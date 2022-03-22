const fillOutTheForm = (form, entity, ...fields) => {
  const excludedFields = ['guides', 'photo', 'imageCover'];
  fields.forEach((field) => {
    // Nêu input là kiểu select (như guides) thì bỏ qua
    if (!excludedFields.includes(field)) {
      form.append(`${field}`, document.querySelector(`#${field}`).value);
    }
  });

  // Nêu điền form tours
  if (entity === 'tours') {
    // Xử lý multiple select
    const selectGuideOptions = document.getElementById('guides').options;

    const selectedGuides = [];
    for (const option of selectGuideOptions) {
      if (option.selected) {
        selectedGuides.push(option.value);
      }
    }

    if (!(selectedGuides.length === 0)) {
      form.append('guides', selectedGuides);
    }

    // Xử lý file upload
    const imageCover = document.getElementById('imageCover').files[0];
    if (imageCover) {
      form.append('imageCover', imageCover);
    }

    // Xử lý nhập locations
    const locations = [];
    const totalNumberOfLocations = document.querySelectorAll(
      'div.row#locations-container>div.col-6'
    ).length;

    if (totalNumberOfLocations) {
      for (let i = 0; i < totalNumberOfLocations; i++) {
        const longtitude = document.getElementById(`longtitude${i + 1}`).value;
        const latitude = document.getElementById(`latitude${i + 1}`).value;
        const description = document.getElementById(
          `description${i + 1}`
        ).value;
        const day = document.getElementById(`day${i + 1}`).value;
        locations.push({ longtitude, latitude, description, day });
      }
      form.append('locations', JSON.stringify(locations));
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
