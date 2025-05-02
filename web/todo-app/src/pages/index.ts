//export { default as HomePage } from './HomePage';
//export { default as LoginPage } from './LoginPage';
//export { default as RegisterPage } from './RegisterPage'; 
//export { default as TasksPage } from './TasksPage';
//export { default as ProfilePage } from './ProfilePage';
//export { default as NotFoundPage } from './NotFoundPage';

// Directly import/export the components to avoid barrel exports
// which are causing errors with default exports
import HomePage from './HomePage';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage'; 
import TasksPage from './TasksPage';
import ProfilePage from './ProfilePage';
import NotFoundPage from './NotFoundPage';

export {
  HomePage,
  LoginPage,
  RegisterPage,
  TasksPage,
  ProfilePage,
  NotFoundPage
}; 