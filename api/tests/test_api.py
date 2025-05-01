"""
API integration tests.
"""
import os
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Set testing environment
os.environ["TESTING"] = "1"

from app.main import app
from app.models.database import Base, get_db, TEST_DATABASE_URL
from app.auth.security import get_password_hash

# Create test database
engine = create_engine(TEST_DATABASE_URL)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Fixtures
@pytest.fixture(scope="function")
def test_db():
    """Create a fresh test database for each test."""
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def client(test_db):
    """Create a test client with a test database."""
    def override_get_db():
        try:
            yield test_db
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as c:
        yield c


# Tests
def test_read_root(client):
    """Test the root endpoint."""
    response = client.get("/")
    assert response.status_code == 200
    assert "message" in response.json()


def test_health_check(client):
    """Test the health check endpoint."""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_register_user(client, test_db):
    """Test user registration."""
    response = client.post(
        "/register",
        json={
            "username": "testuser",
            "email": "test@example.com",
            "password": "password123"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["username"] == "testuser"
    assert data["email"] == "test@example.com"
    assert "id" in data


def test_login(client, test_db):
    """Test user login."""
    # Create a user
    response = client.post(
        "/register",
        json={
            "username": "testuser",
            "email": "test@example.com",
            "password": "password123"
        }
    )
    assert response.status_code == 200
    
    # Login
    response = client.post(
        "/token",
        data={
            "username": "testuser",
            "password": "password123"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


def test_create_task(client, test_db):
    """Test task creation."""
    # Create a user and log in
    client.post(
        "/register",
        json={
            "username": "testuser",
            "email": "test@example.com",
            "password": "password123"
        }
    )
    
    response = client.post(
        "/token",
        data={
            "username": "testuser",
            "password": "password123"
        }
    )
    
    token = response.json()["access_token"]
    
    # Create a task
    response = client.post(
        "/tasks/",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "description": "Test task",
            "priority": 1,
            "category": "Test"
        }
    )
    
    assert response.status_code == 201
    data = response.json()
    assert data["description"] == "Test task"
    assert data["priority"] == 1
    assert data["category"] == "Test"
    assert "id" in data 