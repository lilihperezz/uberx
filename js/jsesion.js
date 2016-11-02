$(document).ready(function() {
	$("#btn-sesion").click(validate);  
    $("#txtemail").focus(); 
});

function validate() {  
	var formatoEmail = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
    if (!formatoEmail.test($("#txtemail").val())) {
    	$("#txtemail").focus();
        alert('El correo electrónico introducido no es correcto.');
        return false;
    }
    if ($("#txtpassword").val().length < 2) {  
        $("#txtpassword").focus();
        alert("La contraseña es obligatoria");  
        return false;  
    }

    // Guardamos el usuario logueado
    // var user = $("#txtnombre").val() + " " + $("#txtapellido").val();
    // localStorage.setItem("userLogin", user);

    location.href = "mapa.html";
    return true;  
}