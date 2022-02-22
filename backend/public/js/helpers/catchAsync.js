import errorMessageHandler from './errorMessageHandler';

const catchAsync = (fn) => {
  return (...params) => {
    fn(...params).catch((error) => {
      // Xóa các error message cũ
      const invalidInputs = document.querySelectorAll('.is-invalid');
      const invalidFeedbacks = document.querySelectorAll('.invalid-feedback');
      const commonErrorElement = document.querySelector('#commonError');

      if (invalidInputs && invalidFeedbacks) {
        invalidInputs.forEach((input) => input.classList.remove('is-invalid'));
        invalidFeedbacks.forEach(
          (messageElement) => (messageElement.innerText = '')
        );
      }

      if (commonErrorElement) {
        commonErrorElement.innerText = '';
      }

      // Chuyển đổi error từ string sang object
      const errorsObj = errorMessageHandler(error.response.data);

      if (error.response.data.status === 'error') {
        Object.keys(errorsObj).forEach((key) => {
          const invalidInputElement = document.querySelector(`input#${key}`);
          const invalidTextareaElement = document.querySelector(
            `textarea#${key}`
          );
          const invalidSelectElement = document.querySelector(`select#${key}`);

          if (invalidInputElement) {
            invalidInputElement.classList.add('is-invalid');
            invalidInputElement.nextSibling.innerText = errorsObj[key];
          }

          if (invalidTextareaElement) {
            invalidTextareaElement.classList.add('is-invalid');
            invalidTextareaElement.nextSibling.innerText = errorsObj[key];
          }

          if (invalidSelectElement) {
            console.log('a');
            invalidSelectElement.classList.add('is-invalid');
            invalidSelectElement.nextSibling.innerText = errorsObj[key];
          }
        });
      } else if (error.response.data.status === 'fail') {
        commonErrorElement.innerText = error.response.data.message;
      }
    });
  };
};

export default catchAsync;
