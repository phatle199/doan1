import axios from 'axios';

export default async (tourSelectElement, userSelectElement) => {
  if (tourSelectElement !== '' && userSelectElement !== '') {
    tourSelectElement.addEventListener('change', async (e) => {
      const tourId = e.target.value;
      const response = await axios({
        url: `/api/v1/tours/${tourId}`,
      });

      document.querySelector('input#price').value =
        response.data.data.data.price;
    });

    userSelectElement.addEventListener('change', async (e) => {
      const userId = e.target.value;
      const response = await axios({
        url: `/api/v1/users/${userId}`,
      });

      document.querySelector('input#phoneNumber').value =
        response.data.data.data.phoneNumber;
    });
  }
};
