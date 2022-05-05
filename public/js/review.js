import axios from 'axios';
import catchAsync from './helpers/catchAsync';

export default catchAsync(async (content, rating) => {
  const url = `/api/v1${location.pathname}/reviews`;

  const res = await axios({
    method: 'POST',
    url,
    data: { review: content, rating },
  });
  if (res.data.status === 'success') {
    location.reload();
  }
});
