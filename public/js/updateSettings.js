import axios from 'axios';
import catchAsync from './helpers/catchAsync';

export default catchAsync(async (data, type) => {
  const url = `http://127.0.0.1:5000/api/v1/users/${
    type === 'data' ? 'update-my-data' : 'update-my-password'
  }`;

  const res = await axios({
    method: 'PATCH',
    url,
    data,
  });

  if (res.data.status === 'success') {
    alert(`Updated success!`);
    location.reload();
  }
});
