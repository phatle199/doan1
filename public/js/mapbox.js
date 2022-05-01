/* eslint-disable */
export const displayMap = (locations) => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoidmlldHBoYXR0MTkwOSIsImEiOiJjbDJneWI5N2MwMTB4M2JxNm9haDZla213In0.jQrQNVVcbktxeZ4WfKcZvw';
  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v10',
    scrollZoom: false,
  });

  // initial bounds
  const bounds = new mapboxgl.LngLatBounds();
  locations.forEach((loc) => {
    // Create marker element
    const el = document.createElement('div');
    el.className = 'marker';

    // Add marker to map: option element, anchor -> set coordinates -> add to map
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom',
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    // Add popup to map: option offset -> set coordinates -> set html for popup -> add to map
    new mapboxgl.Popup({
      offset: 30,
      closeOnClick: false,
    })
      .setLngLat(loc.coordinates)
      .setHTML(`Day ${loc.day}: ${loc.description}`)
      .addTo(map);

    // Extend map bounds to include current location
    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 200,
      right: 200,
    },
  });
};
