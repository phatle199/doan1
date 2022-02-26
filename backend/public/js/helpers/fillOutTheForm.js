const fillOutTheForm = (form, entity, ...fields) => {
  const excludedFields = ['guides', 'photo', 'imageCover'];
  fields.forEach((field) => {
    // Nêu input là kiểu select (như guides) thì bỏ qua
    if (!excludedFields.includes(field)) {
      form.append(`${field}`, document.querySelector(`#${field}`).value);
    }
  });

  // Nêu điền form tours thì có multiple select như guides
  if (entity === 'tours') {
    const selectGuideOptions = document.getElementById('guides').options;

    const selectedGuides = [];
    for (const option of selectGuideOptions) {
      if (option.selected) {
        selectedGuides.push(option.value);
      }
    }

    form.append('guides', selectedGuides);

    const imageCover = document.getElementById('imageCover').files[0];
    if (imageCover) {
      form.append('imageCover', imageCover);
    }
  }

  if (entity === 'users') {
    // Nếu có upload file hình ảnh
    const photo = document.querySelector('#photo').files[0];
    if (photo) {
      form.append('photo', photo);
    }
  }
};

export default fillOutTheForm;
