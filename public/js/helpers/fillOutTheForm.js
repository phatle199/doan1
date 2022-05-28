const fillOutTheForm = (form, entity, ...fields) => {
  const excludedFields = ['guides', 'photo', 'imageCover', 'images'];
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
    form.append('guides', selectedGuides);

    // if (selectedGuides.length !== 0) {
    //   form.append('guides', selectedGuides);
    // }

    // Xử lý file upload
    const imageCover = document.getElementById('imageCover')?.files[0];
    if (imageCover) {
      form.append('imageCover', imageCover);
    }

    // Xử lý upload nhiều files
    const imagesLength = document.getElementById('images')?.files.length;
    const images = document.getElementById('images')?.files;
    if (images && imagesLength != 0) {
      for (let i = 0; i < imagesLength; i++) {
        form.append('images', images[i]);
      }
    }

    // Xử lý nhập locations, startDates
    const locations = [];
    const startDates = [];
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
        const startDate = document.getElementById(`startDate${i + 1}`).value;
        locations.push({ longtitude, latitude, description, day });
        startDates.push(startDate);
      }
      form.append('locations', JSON.stringify(locations));
      form.append('startDates', JSON.stringify(startDates));
    }
  }

  if (entity === 'users') {
    // Nếu có upload file hình ảnh
    const photo = document.querySelector('#photo')?.files[0];
    if (photo) {
      form.append('photo', photo);
    }
  }

  for (const i of form) {
    console.log(i[0], i[1]);
  }
};

export default fillOutTheForm;
