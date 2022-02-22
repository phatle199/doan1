const fillOutTheForm = (form, entity, ...fields) => {
  const excludedFields = ['guides', 'photo'];
  fields.forEach((field) => {
    // Nêu input là kiểu select (như guides) thì bỏ qua
    if (!excludedFields.includes(field)) {
      form.append(`${field}`, document.querySelector(`#${field}`).value);
    }
  });

  // Nêu điền form tours thì có multiple select như guides
  if (entity === 'tours') {
    const selectedGuides = [];
    for (const option of document.querySelector('#guides').options) {
      if (option.selected) selectedGuides.push(option.value);
    }
    form.append('guides', JSON.stringify(selectedGuides));
  }

  // Nếu có upload file hình ảnh
  if (fields.includes('photo') && document.querySelector('#photo').files[0]) {
    form.append('photo', document.querySelector('#photo').files[0]);
  }
};

export default fillOutTheForm;
