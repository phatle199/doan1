import axios from 'axios';
import catchAsync from './helpers/catchAsync';

export const addOneDocument = catchAsync(async (data, entity) => {
  const url = `/api/v1/${entity}`;

  const res = await axios({
    method: 'POST',
    url,
    data,
  });

  if (res.data.status === 'success') {
    alert(`Added success!`);
    location.replace(`/me/manage-${entity}`);
  }
});

export const updateOneDocument = catchAsync(async (data, id, entity) => {
  const url = `/api/v1/${entity}/${id}`;

  const res = await axios({
    method: 'PATCH',
    url,
    data,
  });

  if (res.data.status === 'success') {
    alert('Updated success!');
    location.replace(`/me/manage-${entity}`);
  }
});

export const deleteOneDocument = async (id, entity) => {
  if (confirm('Are you sure you want to delete this document?')) {
    const url = `/api/v1/${entity}/${id}`;
    try {
      const res = await axios({
        method: 'DELETE',
        url,
      });
      console.log(res);
      if (res.status === 204) {
        alert('Deleted success!');
        location.replace(`/me/manage-${entity}`);
      }
    } catch (error) {
      alert(error.response.data.message);
    }
  }
};
