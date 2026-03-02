document.addEventListener('DOMContentLoaded', () => {
  if (mapApiKey && campground) {
    maptilersdk.config.apiKey = mapApiKey;
    const map = new maptilersdk.Map({
      container: 'map', // container's id or the HTML element to render the map
      style: maptilersdk.MapStyle.DATAVIZ.DARK,
      center: campground.geometry.coordinates, // starting position [lng, lat]
      zoom: 6, // starting zoom
    });
    const marker = new maptilersdk.Marker()
      .setLngLat(campground.geometry.coordinates)
      .setPopup(
        new maptilersdk.Popup().setHTML(
          `<h6>${campground.title}</h6><p>${campground.location}</p>`,
        ),
      )
      .addTo(map);

    return;
  }
  console.log('campground: ' + campground);
});
