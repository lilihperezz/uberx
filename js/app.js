$(document).ready(function() {
	$("#btn-prueba").click(contenido);
	$('.modal-trigger').leanModal();
    $('.button-collapse').sideNav({
     	menuWidth: 230,
      	edge: 'left', 
      	closeOnClick: true 
    });
});

function contenido(evento){
	$("#conten-partida").addClass("ocultar");
	$("#conten-llegada").removeClass("ocultar");
	$(".titulo").text("Confirmación");
	$(".menu").addClass("ocultar");
	$("#icon").removeClass("ocultar");
	$("#conten-ubers").addClass("ocultar");
	$("#conten-pedido").removeClass("ocultar");
	$("#btn-prueba").addClass("ocultar");
}

var map;
var geocoder;
var autocomplete;
var markerStart;
var markers = [];

function initAutocomplete() {
	// Validar si el navegador tiene geolocalización
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(loadMap, errores);
    } else {
        alert('Oops! Tu navegador no soporta geolocalización.');
    }

	var properties = {
		types: ['geocode'],
		//types: ['(address)'],
		//types: ['(cities)'],
  		componentRestrictions: {country: 'pe'}
	};

	// Creamos el objeto autocomplete, restringuido la busqueda por pais {country: 'pe'}
	autocomplete = new google.maps.places.Autocomplete(document.getElementById('start'), properties);
	autocomplete.addListener('place_changed', function setDirection() {
    	setDirectionInicio($("#start").val());
		showDirectionStart($("#start").val());
	});

	autocomplete = new google.maps.places.Autocomplete(document.getElementById('end'), properties);
	autocomplete.addListener('place_changed', function setDirection() {
		showDirectionEnd($("#end").val());
	});
}

function loadMap(position) {
	var lat = position.coords.latitude; // Guardamos nuestra latitud
    var lon = position.coords.longitude; // Guardamos nuestra longitud
    var latlon = new google.maps.LatLng(lat, lon); // Creamos un punto con nuestras coordenadas
 	$("#mapa").addClass("classMap");

    var propertieMap = {
	    center: latlon, // Definimos la posicion del mapa con el punto
	    zoom: 16,
	    mapTypeId: google.maps.MapTypeId.ROADMAP,
	    mapTypeControl: false,
	   	disableDefaultUI: true,
	   	streetViewControl: false,
	   	zoomControl: false
    };
    // Creamos el mapa y lo situamos en su capa
    map = new google.maps.Map(document.getElementById('mapa'), propertieMap);
    // Creamos el objeto principal para realizar la petición de consulta a Google Maps
    geocoder = new google.maps.Geocoder();
    // Marcamos nuestra ubicación
	myLocation();
    // Marcamos los autos disponibles
	searchCarDisponible();
 }

function myLocation() {
	var latlon = map.getCenter(); // Obtener la posición del mapa
    var propertieMarker = {
    	map: map, // Vinculamos al mapa
    	position: latlon, // Nos situamos en nuestro punto
    	draggable: true, // Nos permite poder mover el marcador
    	icon: 'img/marker.png'
    };

    // Creamos un marcador en el mapa
    markerStart = new google.maps.Marker(propertieMarker);
    // Cada vez que insertemos un marcador, la insertamos en el array mediante el método .push()
    markers.push(markerStart);
    // Agregamos la dirección en el input
	setDirectionStart();
	// Agregamos la function a ejecutar al evento de mover el marcador
    google.maps.event.addListener(markerStart, 'position_changed', setDirectionStart);
}

function setDirectionStart() {
	var propertieGeocoder = {
    	latLng: markerStart.getPosition(),
    	region: "PE"
    };
    geocoder.geocode(propertieGeocoder, function processGeocoder(results, status) {
    	if (status == google.maps.GeocoderStatus.OK) {
    		if (results[0]) {
    			var direction = results[0]['formatted_address'];
    			$("#start").val(direction);
    			setDirectionInicio(direction);
    			//$("#start").val(getAddressComponent(results, 'route'));
    		}
    	} else {
			//alert("Error: " + status);
		}
    });
}

function getAddressComponent(address, component) {
	var components = address[0]['address_components'];
 	for (var i in components)
 	{
 		alert(components[i]['types'] + ' = ' + components[i]['long_name']);
 		if (components[i]['types'].indexOf(component) > -1)
 		{
 			//return components[i]['long_name'];
 		}
 	}
 	return false;
}

function searchCarDisponible() {
	var image = 'img/executivecar_black.png';
	var latlon, marker;

	latlon = new google.maps.LatLng(-12.1970864, -76.957076);
    marker = new google.maps.Marker({
    	position: latlon,
    	map: map,
    	icon: image
    });

	latlon = new google.maps.LatLng(-12.198463, -76.952224);
    marker = new google.maps.Marker({
    	position: latlon,
    	map: map,
    	icon: image
    });
}

function errores(err) {
	if (err.code == 0) {
		alert("Oops! Algo ha salido mal");
	}
	if (err.code == 1) {
		alert("Oops! No has aceptado compartir tu posición");
	}
	if (err.code == 2) {
		alert("Oops! No se puede obtener la posición actual");
	}
	if (err.code == 3) {
		alert("Oops! Hemos superado el tiempo de espera");
	}
}

function geolocate() {
  	if (navigator.geolocation) {
    	navigator.geolocation.getCurrentPosition(function(position) {
			var geolocation = {
				lat: position.coords.latitude,
				lng: position.coords.longitude
			};
			var circle = new google.maps.Circle({
				center: geolocation,
				radius: position.coords.accuracy
			});
			autocomplete.setBounds(circle.getBounds());
	    });
	}
}

function setDirectionInicio(direction) {
	var address = "<span>" + direction + "</span>"
	$("#divOrigen").html(address);
}

function showDirectionStart(direction) {
	// var latLng = new google.maps.LatLng(lat, longi);
	// geocoder.geocode({ 'latLng': latLng }, processGeocoder);	
	geocoder.geocode({ "address": direction} , function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
	    	// Eliminamos los marcadores del mapa
	    	deleteMarkers();
			// Creamos un marcador en el mapa
	        var marker = new google.maps.Marker({
	        	map: map,
		    	position: results[0].geometry.location,
		    	icon: 'img/marker.png'
	    	});
	    	map.setCenter(marker.getPosition()); // Definimos la posicion del mapa con el punto
		} else {
			alert("Error: " + status);
		}
	});
}

function showDirectionEnd(direction) {
	geocoder.geocode({ "address": direction} , function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			// Creamos un marcador en el mapa
	        var marker = new google.maps.Marker({
	        	map: map,
		    	position: results[0].geometry.location,
		    	icon: 'img/markerEnd.png'
	    	});
	    	showRoute(marker.getPosition());
		} else {
			alert("Error: " + status);
		}
	});
}

function showRoute(position) {
	var latlon = map.getCenter();
	var	latlonDestino = new google.maps.LatLng(position.lat(), position.lng());

	var propertieRoute = {
		origin: latlon, // Origen
		destination: latlonDestino, // Destino
		travelMode: google.maps.TravelMode.DRIVING // Indicaciones para llegar en auto (WALKING = pie)
	}
	var propertieDisplay = {
		map: map,
		suppressMarkers: true
	}

	var dirService = new google.maps.DirectionsService();
	var dirDisplay = new google.maps.DirectionsRenderer(propertieDisplay);

	// Calcular ruta entre 2 ubicaciones
	dirService.route(propertieRoute, function getResponse(results, status) {
		if (status == google.maps.DirectionsStatus.OK) {
			dirDisplay.setDirections(results);
		} else {
			alert("Error: " + status);
		}
	});
}

function deleteMarkers() {
	for (var p in markers) {
		markers[p].setMap(null);
	}
}