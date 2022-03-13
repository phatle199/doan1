import getParamsObject from './helpers/getParamsObject';

export const previousButtonHandler = (previousButton, pageSize) => {
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
};

export const nextButtonHandler = (nextButton, pageSize) => {
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
};
