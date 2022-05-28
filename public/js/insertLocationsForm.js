const showLocationsFormButtonHandler = (showLocationsFormButton) => {
  showLocationsFormButton.addEventListener('click', (e) => {
    const totalNumberOfLocations = +document.querySelector(
      'input#totalNumberOfLocations'
    ).value;

    const locationsFormContainer = document.getElementById(
      'locations-container'
    );

    locationsFormContainer.innerHTML = '';

    for (let i = 1; i < totalNumberOfLocations + 1; i++) {
      locationsFormContainer.insertAdjacentHTML(
        'beforeend',
        `<div class="col-6">
            <p class="text-center mt-2 font-weight-bold">Location ${i}</p>
            <div class="form-group">
                <label for="longtitude${i}">Longtitude</label>
                <input class="form-control" id="longtitude${i}" type="number" step="any" />
            </div>
            <div class="form-group">
                <label for="latitude${i}">Latitude</label>
                <input class="form-control" id="latitude${i}" type="number" step="any" />
            </div>
            <div class="form-group">
                <label for="description${i}">Description</label>
                <input class="form-control" id="description${i}" type="text" />
            </div>
            <div class="form-group">
                <label for="description${i}">Day</label>
                <input class="form-control" id="day${i}" type="number" />
            </div>
            <div class="form-group">
                <label for="startDate${i}">Start date</label>
                <input class="form-control" id="startDate${i}" type="date" />
            </div>
        </div>`
      );
    }
  });
};

export default showLocationsFormButtonHandler;
