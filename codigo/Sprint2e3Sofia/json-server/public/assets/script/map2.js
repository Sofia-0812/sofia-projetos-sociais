let map;
let marker;

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: -19.9187, lng: -43.9667 }, // Coordenadas iniciais (BH)
        zoom: 13
    });

    const input = document.getElementById("pac-input");
    const searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    searchBox.addListener("places_changed", () => {
        const places = searchBox.getPlaces();
        if (places.length === 0) {
            return;
        }

        if (marker) {
            marker.setMap(null);
        }

        const bounds = new google.maps.LatLngBounds();
        places.forEach(place => {
            if (!place.geometry || !place.geometry.location) {
                console.log("Lugar retornado sem geometria");
                return;
            }

            marker = new google.maps.Marker({
                map,
                title: place.name,
                position: place.geometry.location,
            });

            bounds.extend(place.geometry.location);
        });
        map.fitBounds(bounds);
    });

    const urlParams = new URLSearchParams(window.location.search);
    const itemId = urlParams.get('id');


    fetch(`http://localhost:3001/doacoes?id=${itemId}`)
        .then(res => res.json())
        .then(data => {
            if (data && data.length > 0) {
                const projeto = data[0];
                input.value = projeto.localizacao; // Preenche a barra de pesquisa

                // Geocodifica o endereço para obter as coordenadas
                const geocoder = new google.maps.Geocoder();
                geocoder.geocode({ address: projeto.localizacao }, (results, status) => {
                    if (status === "OK") {
                        const location = results[0].geometry.location;
                        map.setCenter(location); // Centraliza o mapa
                        map.setZoom(15); // Ajusta o zoom

                        // Cria um marcador na localização encontrada
                        new google.maps.Marker({
                            map,
                            position: location
                        });
                    } else {
                        console.error(`Erro na geocodificação: ${status}`);
                        alert('Não foi possível encontrar o endereço no mapa. Verifique se o endereço está correto.'); // Mensagem de erro para o usuário
                    }
                });
            } else {
                console.error(`Projeto com ID ${projectId} não encontrado no endpoint.`);
                alert('O projeto não foi encontrado.');
            }
        })
        .catch(err => {
            console.error('Erro ao buscar projeto:', err);
            alert('Ocorreu um erro ao carregar os detalhes do projeto. Por favor, tente novamente mais tarde.');
        });
}

window.initMap = initMap; // Exporta a função initMap para o escopo global
