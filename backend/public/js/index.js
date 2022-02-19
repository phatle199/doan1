import '@babel/polyfill';
import { login } from './login';
import { logout } from './login';

if (document.querySelector('#login-form')) {
  document.querySelector('#login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;
    login(email, password);
  });
}

if (document.querySelector('#log-out-btn')) {
  document.querySelector('#log-out-btn').addEventListener('click', (e) => {
    e.preventDefault();
    logout();
  });
}
