const errorMessageHandler = (error) => {
  // xử lý lỗi validation
  let errorsArray;
  if (error.error.name === 'ValidationError') {
    errorsArray = error.message
      .slice(error.message.indexOf('failed: ') + 'failed: '.length)
      .split(', ');
    // ['description: Một tour phải có mô tả', 'summary: Một tour phải có tóm tắt']
  }

  if (error.error.code === 11000) {
    const field = Object.keys(error.error.keyValue)[0];
    const value = error.error.keyValue[Object.keys(error.error.keyValue)[0]];
    errorsArray = [`${field}: ${value} has already used. Try another one.`];
  }

  if (error.status === 'fail') {
    errorsArray = [`commonError: ${error.message}`];
  }

  const errorsObject = {};
  errorsArray.forEach((errorMessage) => {
    errorsObject[errorMessage.slice(0, errorMessage.indexOf(':'))] =
      errorMessage.slice(errorMessage.indexOf(': ') + 2);
  });

  return errorsObject;
};

export default errorMessageHandler;
