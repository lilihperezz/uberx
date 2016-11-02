$(document).ready(function() {
	$("#btn-prueba").click(contenido);
	$("#puntos-verticales").click(editarPerfil);
	$('.modal-trigger').leanModal();
    $('.button-collapse').sideNav({
     	menuWidth: 230,
      	edge: 'left', 
      	closeOnClick: true 
    });  

    var userLogin = localStorage.getItem("userLogin");
    if (userLogin != "") {
    	$("label[for='lblUsuarioLogin']").text(userLogin);
    }
    $("label[for='lblPrecio']").text("");
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
function editarPerfil(evento){
	$(".editar").removeClass("ocultar");
}

var map;
var geocoder;
var autocomplete;
var markerInicio;
var markers = [];
var markersDestino = [];

function initAutocomplete() {
	// Validar si el navegador tiene geolocalización
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(cargarMapa, errores);
    } else {
        alert('Oops! Tu navegador no soporta geolocalización.');
    }

	var properties = {
		types: ['geocode'],
  		componentRestrictions: {country: 'pe'}
	};

	// Creamos el objeto autocomplete para input Inicio, restringuido la busqueda por pais {country: 'pe'}
	autocomplete = new google.maps.places.Autocomplete(document.getElementById('txtInicio'), properties);
	autocomplete.addListener('place_changed', function setDirection() {
    	agregarDireccionInicio2($("#txtInicio").val());
		mostrarDireccionInicio($("#txtInicio").val());
	});

	// Creamos el objeto autocomplete para input Destino
	autocomplete = new google.maps.places.Autocomplete(document.getElementById('txtDestino'), properties);
	autocomplete.addListener('place_changed', function setDirection() {
		mostrarDireccionDestino($("#txtDestino").val());
	});
}

function cargarMapa(position) {
	var lat = position.coords.latitude; // Guardamos nuestra latitud
    var lon = position.coords.longitude; // Guardamos nuestra longitud
    var latlon = new google.maps.LatLng(lat, lon); // Creamos un punto con nuestras coordenadas
 	$("#mapa").addClass("classMap");

    var propiedadMapa = {
	    center: latlon, // Definimos la posicion del mapa con el punto
	    zoom: 16,
	    mapTypeId: google.maps.MapTypeId.ROADMAP,
	    mapTypeControl: false,
	   	disableDefaultUI: true,
	   	streetViewControl: false,
	   	zoomControl: false
    };
    // Creamos el mapa y lo situamos en su capa
    map = new google.maps.Map(document.getElementById('mapa'), propiedadMapa);
    // Creamos el objeto principal para realizar la petición de consulta a Google Maps
    geocoder = new google.maps.Geocoder();
    // Marcamos nuestra ubicación
	miUbicacion();
    // Marcamos los autos disponibles
	buscarAutoDisponible();
 }

function miUbicacion() {
	var latlon = map.getCenter(); // Obtener la posición del mapa
    var propiedadMarker = {
    	map: map, // Vinculamos al mapa
    	position: latlon, // Nos situamos en nuestro punto
    	draggable: true, // Nos permite poder mover el marcador
    	icon: 'img/marker.png'
    };

    // Creamos un marcador en el mapa
    markerInicio = new google.maps.Marker(propiedadMarker);
    // Cada vez que insertemos un marcador, la insertamos en el array mediante el método .push()
    markers.push(markerInicio);
    // Agregamos la dirección en el input (Punto de Partida)
	agregarDireccionInicio();
	// Agregamos la function a ejecutar al evento de mover el marcador
    google.maps.event.addListener(markerInicio, 'position_changed', agregarDireccionInicio);
}

function agregarDireccionInicio() {
	var propertieGeocoder = {
    	latLng: markerInicio.getPosition(),
    	region: "PE"
    };
    geocoder.geocode(propertieGeocoder, function processGeocoder(results, status) {
    	if (status == google.maps.GeocoderStatus.OK) {
    		if (results[0]) {
    			var direction = results[0]['formatted_address'];
    			$("#txtInicio").val(direction);
    			agregarDireccionInicio2(direction);
    		}
    	} else {
			//alert("Error: " + status);
		}
    });
}

function buscarAutoDisponible() {
	var image = 'img/executivecar_black.png';
	var latlon, marker;

	// Autos disponibles Casa
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

    // Autos disponibles Laboratoria
	latlon = new google.maps.LatLng(-12.119120, -77.035144);
    marker = new google.maps.Marker({
    	position: latlon,
    	map: map,
    	icon: image
    });    

	latlon = new google.maps.LatLng(-12.119395, -77.034771);
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

function agregarDireccionInicio2(direction) {
	var address = "<span>" + direction + "</span>"
	$("#divOrigen").html(address);
}

function mostrarDireccionInicio(direction) {
	// var latLng = new google.maps.LatLng(lat, longi);
	// geocoder.geocode({ 'latLng': latLng }, processGeocoder);	
	geocoder.geocode({ "address": direction} , function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
	    	// Eliminamos los marcadores del mapa
	    	eliminarMarkers(markers);
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

function mostrarDireccionDestino(direction) {
	geocoder.geocode({ "address": direction} , function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			// Eliminamos los marcadores "destino" del mapa
	    	eliminarMarkers(markersDestino);
			// Creamos un marcador en el mapa
	        var marker = new google.maps.Marker({
	        	map: map,
		    	position: results[0].geometry.location,
		    	icon: 'img/markerEnd.png'
	    	});
	    	mostrarRuta(marker.getPosition());
		    // Cada vez que insertemos un marcador, la insertamos en el array mediante el método .push()
		    markersDestino.push(marker);	    	
		} else {
			alert("Error: " + status);
		}
	});
}

function mostrarRuta(position) {
	var latlon = map.getCenter();
	var	latlonDestino = new google.maps.LatLng(position.lat(), position.lng());

	var propiedadRuta = {
		origin: latlon, // Origen
		destination: latlonDestino, // Destino
		travelMode: google.maps.TravelMode.DRIVING // Indicaciones para llegar en auto (WALKING = pie)
	}
	var propiedadDisplay = {
		map: map,
		suppressMarkers: true
	}

	var dirService = new google.maps.DirectionsService();
	var dirDisplay = new google.maps.DirectionsRenderer(propiedadDisplay);

	//dirDisplay.setDirections({routes: []});

	// Calcular ruta entre 2 ubicaciones
	dirService.route(propiedadRuta, function getResponse(results, status) {
		if (status == google.maps.DirectionsStatus.OK) {
			dirDisplay.setDirections(results);
			// Se obtiene el precio
			obtenerPrecio();
		} else {
			alert("Error: " + status);
		}
	});
}

function eliminarMarkers(listMarker) {
	for (var p in listMarker) {
		listMarker[p].setMap(null);
	}
}

function obtenerPrecio() {
	$("label[for='lblPrecio']").text("S/. 25.00");
}