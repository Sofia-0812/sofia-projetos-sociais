mapboxgl.accessToken = 'pk.eyJ1Ijoic29maWFnLTA4MTIiLCJhIjoiY2x4ejB6MGlrMDZyOTJqcHgzMDJocW9tNSJ9.ZDUxfh3GAjKSfPdqcQDXCA';

// Criar o mapa
const map = new mapboxgl.Map({
    container: 'mapa',
    style: 'mapbox://styles/mapbox/streets-v11', // Estilo do mapa
    center: [-47.8825, -15.7942], // Coordenadas do centro inicial (exemplo)
    zoom: 12 // Zoom inicial
});

// Adicionar controles de navegação ao mapa
map.addControl(new mapboxgl.NavigationControl());

// Verificar se mapboxgl foi carregado corretamente antes de usar MapboxGeocoder
if (typeof mapboxgl !== 'undefined') {
    // Criar barra de busca
    const geocoder = map.addControl(
        new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl
        })
        );

    // Adicionar barra de busca ao mapa
    map.addControl(geocoder);

    // Atualizar o mapa com base na localização selecionada na barra de busca
    geocoder.on('result', function (e) {
        map.flyTo({
            center: e.result.center, // Centralizar no resultado da busca
            zoom: 14 // Zoom ao qual o mapa deve ser ajustado
        });
    });
} else {
    console.error('Erro: mapboxgl não está definido. Verifique se os scripts do Mapbox foram carregados corretamente.');
}
