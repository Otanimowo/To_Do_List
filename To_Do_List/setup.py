"""
Setup script for the to-do list application.
"""
from setuptools import setup, find_packages

setup(
    name="todo_app",
    version="1.0.0",
    author="Olushola Tanimowo",
    description="A modular to-do list application",
    packages=find_packages(),
    classifiers=[
        "Programming Language :: Python :: 3",
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent",
    ],
    python_requires=">=3.6",
    entry_points={
        "console_scripts": [
            "todo=todo_app.app:main",
        ],
    },
) 