import axios from 'axios';
import catchAsync from './helpers/catchAsync';

export const signup = catchAsync(
  async (name, email, password, passwordConfirm) => {
    const res = await axios({
      method: 'post',
      url: '/api/v1/users/signup',
      data: {
        name,
        email,
        password,
        passwordConfirm,
      },
    });

    if (res.data.status === 'success') {
      alert('Signed up successfully!');
      setTimeout(() => {
        location.assign('/');
      }, 500);
    }
  }
);

export const login = catchAsync(async (email, password) => {
  const res = await axios({
    method: 'post',
    url: '/api/v1/users/login',
    data: {
      email,
      password,
    },
  });

  if (res.data.status === 'success') {
    alert('Logged in successfully!');
    setTimeout(() => {
      location.assign('/');
    }, 500);
  }
});

export const logout = async () => {
  try {
    const res = await axios({
      url: '/api/v1/users/logout',
    });

    if (res.data.status === 'success') location.assign('/');
  } catch (error) {
    alert('There is something wrong. Please try again!');
  }
};
