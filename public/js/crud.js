import axios from 'axios';
import catchAsync from './helpers/catchAsync';

export const addOneDocument = catchAsync(async (data, entity) => {
  const url = `http://127.0.0.1:5000/api/v1/${entity}`;

  const res = await axios({
    method: 'POST',
    url,
    data,
  });

  if (res.data.status === 'success') {
    alert(`Added success!`);
    location.reload();
  }
});

export const updateOneDocument = catchAsync(async (data, id, entity) => {
  const url = `http://127.0.0.1:5000/api/v1/${entity}/${id}`;

  const res = await axios({
    method: 'PATCH',
    url,
    data,
  });

  if (res.data.status === 'success') {
    alert('Updated success!');
    location.reload();
  }
});

export const deleteOneDocument = async (id, entity) => {
  if (confirm('Are you sure you want to delete this document?')) {
    const url = `http://127.0.0.1:5000/api/v1/${entity}/${id}`;
    try {
      const res = await axios({
        method: 'DELETE',
        url,
      });

      if (res.data.status === 'success') {
        alert('Deleted success!');
        location.reload();
      }
    } catch (error) {
      alert(error.response.data.message);
    }
  }
};
