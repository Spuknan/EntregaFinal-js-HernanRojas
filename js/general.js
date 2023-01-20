// Funcion calcular edad.
function calcularEdad(fechaNacimiento) {
   if (!fechaNacimiento) {
      return "No registrada";
   }
   const fechaActual = new Date();
   const fechaNacimientoArray = fechaNacimiento.split("/");
   const dia = parseInt(fechaNacimientoArray[0]);
   const mes = parseInt(fechaNacimientoArray[1]);
   const anio = parseInt(fechaNacimientoArray[2]);
   let edad = fechaActual.getFullYear() - anio;
   const mesActual = fechaActual.getMonth();
   const diaActual = fechaActual.getDate();
   if (mesActual < mes - 1) {
      edad--;
   }
   if (mes - 1 == mesActual && diaActual < dia) {
      edad--;
   }
   return edad;
}



// Chequear actividad y desloguear.
let ultimaActividad = new Date();
function checkInactividad() {
   let currentTime = new Date();
   let diffInMinutes = (currentTime - ultimaActividad) / 1000 / 60;
   if (diffInMinutes > 2) {
      desloguear();
   }
}

setInterval(checkInactividad, 60000);

function desloguear() {
   localStorage.removeItem("userVerificado");
   localStorage.removeItem("admin");
   localStorage.removeItem("userIndex");
   window.location.href = "../index.html";
}

document.addEventListener('mousemove', function () {
   ultimaActividad = new Date();
});
document.addEventListener('keypress', function () {
   ultimaActividad = new Date();
});

window.onload = function () {
   checkInactividad();
};