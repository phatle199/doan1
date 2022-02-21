import '@babel/polyfill';
import { login } from './login';
import { logout } from './login';
import { addOneDocument, updateOneDocument, deleteOneDocument } from './crud';

const loginForm = document.querySelector('#login-form');
const logoutBtn = document.querySelector('#log-out-btn');

const changeTourForm = document.querySelector('#change-tour-form');
const addNewTourForm = document.querySelector('#add-new-tour-form');
const deleteTourBtn = document.querySelectorAll('#btn-delete-tour');

const changeUserForm = document.querySelector('#change-user-form');
const addNewUserForm = document.querySelector('#add-new-user-form');
const deleteUserBtn = document.querySelectorAll('#btn-delete-user');

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

// AUTH
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;
    login(email, password);
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener('click', (e) => {
    e.preventDefault();
    logout();
  });
}

// MANAGE TOURS
if (addNewTourForm) {
  addNewTourForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = new FormData();
    fillOutTheForm(
      form,
      'tours',
      'name',
      'price',
      'duration',
      'difficulty',
      'maxGroupSize',
      'summary',
      'description',
      'guides'
    );

    await addOneDocument(form, 'tours');
  });
}

if (changeTourForm) {
  changeTourForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = new FormData();
    fillOutTheForm(
      form,
      'tours',
      'name',
      'price',
      'duration',
      'difficulty',
      'maxGroupSize',
      'summary',
      'description',
      'guides'
    );

    await updateOneDocument(
      form,
      document.querySelector('#tour-id').value,
      'tours'
    );
  });
}

if (deleteTourBtn) {
  deleteTourBtn.forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      await deleteOneDocument(btn.dataset.tourid, 'tours');
    });
  });
}

// MANAGE USERS
if (addNewUserForm) {
  addNewUserForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = new FormData();
    fillOutTheForm(
      form,
      'users',
      'name',
      'email',
      'password',
      'passwordConfirm',
      'role'
    );

    await addOneDocument(form, 'users');
  });
}

if (changeUserForm) {
  changeUserForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = new FormData();
    if (document.querySelector('#password').value !== '') {
      fillOutTheForm(
        form,
        'users',
        'photo',
        'name',
        'email',
        'password',
        'role'
      );
    } else {
      fillOutTheForm(form, 'users', 'photo', 'name', 'email', 'role');
    }

    await updateOneDocument(
      form,
      document.querySelector('#user-id').value,
      'users'
    );
  });

  // Thêm tính năng hiển thị hình sau khi chọn file xong
  document.querySelector('.browse').addEventListener('click', function () {
    const file = document
      .querySelector('.browse')
      .closest('.input-group').previousSibling;
    file.click();
  });

  document
    .querySelector('input[type="file"]')
    .addEventListener('change', function (e) {
      const fileName = e.target.files[0].name;
      document.querySelector('#file').value = fileName;

      const reader = new FileReader();
      reader.onload = function (e) {
        // get loaded data and render thumbnail.
        document.getElementById('preview').src = e.target.result;
      };
      // read the image file as a data URL.
      reader.readAsDataURL(this.files[0]);
    });
}

if (deleteUserBtn) {
  deleteUserBtn.forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      await deleteOneDocument(btn.dataset.userid, 'users');
    });
  });
}
