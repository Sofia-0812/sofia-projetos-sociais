mapboxgl.accessToken = 'pk.eyJ1IjoibXlrYWlseSIsImEiOiJjbHh3MWp5dmcwdTQzMmpvY24zdXM2YXVvIn0.CuUdpnMxp9hyR5DUy6AacQ';

var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [-74.5, 40],
    zoom: 9
});

var geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl,
    marker: {
        color: 'orange'
    }
});

document.querySelector('.map-overlay').appendChild(geocoder.onAdd(map));

map.addControl(new mapboxgl.NavigationControl());
map.addControl(new mapboxgl.GeolocateControl({
    positionOptions: {
        enableHighAccuracy: true
    },
    trackUserLocation: true
}));
map.addControl(new mapboxgl.FullscreenControl());
map.addControl(new mapboxgl.ScaleControl({
    maxWidth: 80,
    unit: 'metric'
}));

