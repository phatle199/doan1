import axios from 'axios';

const transformInputData = (data) => {
  const result = {};
  for (const input of data.entries()) {
    if (input[0] === 'guides') {
      result[input[0]] = JSON.parse(input[1]);
    } else {
      result[input[0]] = input[1];
    }
  }
  return result;
};

export const addOneDocument = async (data, entity) => {
  try {
    const transformedInputData = transformInputData(data);

    const url = `http://127.0.0.1:5000/api/v1/${entity}`;

    const res = await axios({
      method: 'POST',
      url,
      data: transformedInputData,
    });

    if (res.data.status === 'success') {
      alert(`Added success!`);
      location.assign(`/manage-${entity}`);
    }
  } catch (error) {
    alert(error.response.data.message);
  }
};

export const updateOneDocument = async (data, id, entity) => {
  try {
    const transformedInputData = transformInputData(data);

    const url = `http://127.0.0.1:5000/api/v1/${entity}/${id}`;

    const res = await axios({
      method: 'PATCH',
      url,
      data: entity === 'users' ? data : transformedInputData,
    });

    if (res.data.status === 'success') {
      alert('Updated success!');
      location.assign(`/manage-${entity}`);
    }
  } catch (error) {
    alert(error.response.data.message);
  }
};

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
        location.assign(`/manage-${entity}`);
      }
    } catch (error) {
      alert(error.response.data.message);
    }
  }
};
