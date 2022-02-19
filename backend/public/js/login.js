import axios from 'axios';

export const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'post',
      url: 'http://127.0.0.1:5000/api/v1/users/login',
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
  } catch (error) {
    alert(error.response.data.message);
  }
};

export const logout = async () => {
  try {
    const res = await axios({
      url: 'http://127.0.0.1:5000/api/v1/users/logout',
    });

    if (res.data.status === 'success') location.assign('/');
  } catch (error) {
    alert('There is something wrong. Please try again!');
  }
};
