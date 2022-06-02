const errorMessageHandler = (error) => {
  let errorsArray;
  console.log(error);
  // xử lý lỗi hết vé hoặc không đủ vé khi đặt tour
  if (error?.message.startsWith('Đặt tour thất bại.')) {
    alert(error.message);
  }

  // xử lý lỗi validation
  if (error.error?.name === 'ValidationError') {
    errorsArray = error.message
      .slice(error.message.indexOf('failed: ') + 'failed: '.length)
      .split(', ');
    // ['description: Một tour phải có mô tả', 'summary: Một tour phải có tóm tắt']
  }

  // Xử lý lỗi bị trùng lặp
  if (error.error?.code === 11000) {
    const field = Object.keys(error.error.keyValue)[0];
    const value = error.error.keyValue[Object.keys(error.error.keyValue)[0]];
    errorsArray = [`${field}: ${value} has already used. Try another one.`];
  }

  // xử lý lỗi chung chung
  if (error.status === 'fail' || error.status === 401) {
    errorsArray = [`commonError: ${error.message}`];
  }

  // chuyển mảng lỗi thành object
  const errorsObject = {};
  errorsArray.forEach((errorMessage) => {
    errorsObject[errorMessage.slice(0, errorMessage.indexOf(':'))] =
      errorMessage.slice(errorMessage.indexOf(': ') + 2);
  });

  return errorsObject;
};

const addErrorMessage = (type, key, errorsObj) => {
  const invalidInputElement = document.querySelector(`${type}#${key}`);

  if (invalidInputElement) {
    invalidInputElement.classList.add('is-invalid');
    invalidInputElement.previousSibling.classList.add('text-danger');
    invalidInputElement.nextSibling.innerText = errorsObj[key];
  }
};

const catchAsync = (fn) => {
  return async (...params) => {
    await fn(...params).catch((error) => {
      // Xóa các error message cũ
      const invalidInputs = document.querySelectorAll('.is-invalid');
      const invalidFeedbacks = document.querySelectorAll('.invalid-feedback');
      const labelsTextDanger = document.querySelectorAll('.text-danger');
      const commonErrorElement = document.querySelector('#commonError');

      if (invalidInputs && invalidFeedbacks) {
        invalidInputs.forEach((input) => input.classList.remove('is-invalid'));
        invalidFeedbacks.forEach(
          (messageElement) => (messageElement.innerText = '')
        );
      }

      if (labelsTextDanger) {
        labelsTextDanger.forEach((labelElement) =>
          labelElement.classList.remove('danger')
        );
      }

      if (commonErrorElement) {
        commonErrorElement.innerText = '';
      }

      // Chuyển đổi error từ string sang object
      const errorsObj = errorMessageHandler(error.response.data);
      console.log(error.response.data);
      // Hiển thị lỗi dưới mỗi input
      if (error.response.data.status === 'error') {
        Object.keys(errorsObj).forEach((key) => {
          addErrorMessage('input', key, errorsObj);
          addErrorMessage('select', key, errorsObj);
          addErrorMessage('textarea', key, errorsObj);
        });
        // Hiển thị lỗi chung
      } else {
        commonErrorElement.innerText = error.response.data.message;
      }
    });
  };
};

export default catchAsync;
