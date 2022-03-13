import '@babel/polyfill';
import { login, logout, signup } from './auth';
import { addOneDocument, updateOneDocument, deleteOneDocument } from './crud';
import fillOutTheForm from './helpers/fillOutTheForm';
import getParamsObject from './helpers/getParamsObject';

const signupForm = document.querySelector('#signup-form');
const loginForm = document.querySelector('#login-form');
const logoutBtn = document.querySelector('#log-out-btn');

const changeTourForm = document.querySelector('#change-tour-form');
const addNewTourForm = document.querySelector('#add-new-tour-form');
const deleteTourBtn = document.querySelectorAll('#btn-delete-tour');

const changeUserForm = document.querySelector('#change-user-form');
const addNewUserForm = document.querySelector('#add-new-user-form');
const deleteUserBtn = document.querySelectorAll('#btn-delete-user');

const browseBtn = document.querySelector('.browse');

const previousButton = document.querySelector('li#previous');
const nextButton = document.querySelector('li#next');
const pageSize = nextButton ? +nextButton.dataset.pageSize : undefined;

if (previousButton) {
  // Nếu nút chọn trang đầu tiên là 1 => ko thể có thêm các trang trước nó
  const firstPageNumberItem =
    +document.querySelectorAll('.page-item')[1].innerText;
  if (firstPageNumberItem === 1) {
    previousButton.classList.add('disabled');
  }

  previousButton.addEventListener('click', (e) => {
    e.preventDefault();

    // 2. Nếu nút prev không bị disabled => giảm các nút trang đi 1
    const pageNumberItems = document.querySelectorAll('.page-number');
    if (!previousButton.classList.contains('disabled')) {
      pageNumberItems.forEach((item) => {
        item.setAttribute(
          'href',
          item
            .getAttribute('href')
            .replace(
              `page=${item.innerHTML}`,
              `page=${Number(item.innerHTML) - 1}`
            )
        );
        item.innerText = +item.innerHTML - 1;
      });
    }

    // 3. Xóa class disabled của nút next
    nextButton.classList.remove('disabled');

    // 4. Nếu nút trang đầu tiên giảm còn 1 => thêm class disabled vào nút prev
    if (Number(pageNumberItems[0].innerText) === 1) {
      previousButton.classList.add('disabled');
    }

    // 5. Thêm class active nếu nút đó có giá trị bằng với trang hiện tại
    const pageNumberParam = Number(getParamsObject().page);
    const currentPageNumber =
      pageNumberParam === 0 || pageNumberParam < 1 ? 1 : pageNumberParam;

    pageNumberItems.forEach((item) => {
      if (Number(item.innerText) === currentPageNumber) {
        item.closest('li').classList.add('active');
      } else {
        item.closest('li').classList.remove('active');
      }
    });
  });
}

if (nextButton) {
  // 1. Nếu nút chọn trang cuối cùng bằng với trang cuối => ko thể có thêm các trang sau nó
  let lastPageNumber = +document.querySelectorAll('.page-item')[3].innerText;
  if (lastPageNumber === pageSize) {
    nextButton.classList.add('disabled');
  }

  nextButton.addEventListener('click', (e) => {
    e.preventDefault();

    // 2. Nếu nút next không bị disabled => tăng các nút trang thêm 1
    if (!nextButton.classList.contains('disabled')) {
      const pageNumberItems = document.querySelectorAll('.page-number');
      pageNumberItems.forEach((item) => {
        item.setAttribute(
          'href',
          item
            .getAttribute('href')
            .replace(
              `page=${item.innerHTML}`,
              `page=${Number(item.innerHTML) + 1}`
            )
        );
        item.innerText = +item.innerHTML + 1;
      });
    }

    // 3. Xóa class disabled của previousButton khi nút trang đầu tiên ko còn là 1 nữa
    previousButton.classList.remove('disabled');

    // 4. Xóa class active của nút trang đang được chọn, thêm class active vào nút trước nó
    const selectedPageNumberItem = document.querySelector('.page-item.active');

    const pageNumberParam = Number(getParamsObject().page);
    const currentPageNumber =
      pageNumberParam === 0 || pageNumberParam < 1 ? 1 : pageNumberParam;
    if (selectedPageNumberItem) {
      // Nếu nút trước nút trang được chọn bằng với trang hiện tại => thêm class active
      const previousSelectedPageNumberItem =
        selectedPageNumberItem.previousSibling;
      if (
        previousSelectedPageNumberItem &&
        currentPageNumber === Number(previousSelectedPageNumberItem.innerText)
      ) {
        previousSelectedPageNumberItem.classList.add('active');
      }

      // Xóa class active
      selectedPageNumberItem.classList.remove('active');
    }

    // 5. Thêm class disabled khi nút trang cuối bằng với số trang
    lastPageNumber = +document.querySelectorAll('.page-item')[3].innerText;
    if (lastPageNumber === pageSize) {
      nextButton.classList.add('disabled');
    }
  });
}

// AUTH
if (signupForm) {
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.querySelector('#name').value;
    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;
    const passwordConfirm = document.querySelector('#passwordConfirm').value;
    signup(name, email, password, passwordConfirm);
  });
}

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
  addNewTourForm.addEventListener('submit', (e) => {
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
      'guides',
      'imageCover'
    );

    addOneDocument(form, 'tours');
  });
}

if (changeTourForm) {
  changeTourForm.addEventListener('submit', (e) => {
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

    updateOneDocument(form, document.querySelector('#tour-id').value, 'tours');
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
  addNewUserForm.addEventListener('submit', (e) => {
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

    addOneDocument(form, 'users');
  });
}

if (changeUserForm) {
  changeUserForm.addEventListener('submit', (e) => {
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

    updateOneDocument(form, document.querySelector('#user-id').value, 'users');
  });
}

if (browseBtn) {
  // Thêm tính năng hiển thị hình sau khi chọn file xong
  browseBtn.addEventListener('click', function () {
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
