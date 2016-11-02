$(document).ready(function() {
	$("#txttelefono").keydown(soloNumeros);
	// $("#btn-siguiente").click(validate);  
    $("#txtnombre").focus(); 
});

function soloNumeros(evento) {
	var ascii = evento.keyCode;
	if (ascii == 8 || (ascii >= 48 && ascii <= 57)) {
		return true;
	} else {
		return false;
	}
}

function validate() {  
    if ($("#txtnombre").val().length < 2) { 
    	$("#txtnombre").focus(); 
        alert("El nombre es obligatorio");  
        return false;  
    }
    if ($("#txtapellido").val().length < 2) {  
    	$("#txtapellido").focus();
        alert("El apellido es obligatorio");  
        return false;  
    }
	var formatoEmail = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
    if (!formatoEmail.test($("#txtemail").val())) {
    	$("#txtemail").focus();
        alert('El correo electrónico introducido no es correcto.');
        return false;
    }
    if ($("#txttelefono").val().length < 9) {  
    	$( "#txttelefono" ).focus();
        alert("El formato del telefono ingresado no es correcto");  
        return false;  
    }
    // Guardamos el usuario logueado
    // var user = $("#txtnombre").val() + " " + $("#txtapellido").val();
    // localStorage.setItem("userLogin", user);

    return true;  
}

var cambiarFoto = function(e) {
    if(e.target.files && e.target.files[0]) {
        var reader = new FileReader();

        reader.onload = function(e) {
            var guardarFoto = e.target.result;
            $("#fotoprev").attr("src", guardarFoto);
            localStorage.setItem("guardarFoto", guardarFoto);
        }
        reader.readAsDataURL(e.target.files[0]);
    }
}