// Retomando datos del localStorage.
let usersArray = JSON.parse(localStorage.getItem('usersArray'));
console.table(usersArray);

let suscripcionesArray = JSON.parse(localStorage.getItem('suscripcionesArray'));
console.table(suscripcionesArray);

const userIndex = JSON.parse(localStorage.getItem('userIndex'));

// Mostrar el nombre de usuario en el panel.
document.getElementById('userNameInfo').innerHTML = "<p>" + usersArray[userIndex].nombre + " " + usersArray[userIndex].apellido + "</p>";

// Función para verificar si el usuario está logueado y si es un cliente.
function clientLoginVerificacion() {
   if (localStorage.getItem('userVerificado') === 'true' && localStorage.getItem('admin') === 'false') {
      return true
   } else if (localStorage.getItem('userVerificado') === 'true' && localStorage.getItem('admin') === 'true') {
      window.location.href = "adminpanel.html";
   } else {
      window.location.href = "index.html";
   }
}
clientLoginVerificacion();

// Asignar eventos a los botones del panel.
document.getElementById("datosPersonales").addEventListener("click", datosPersonales);
document.getElementById("miSuscripcion").addEventListener("click", miSuscripcion);
document.getElementById("infoContacto").addEventListener("click", infoContacto);
document.getElementById("verSuscripciones").addEventListener("click", verSuscripciones);
document.getElementById("infoNutricional").addEventListener("click", infoNutricional);
document.getElementById("irALogin").addEventListener("click", irALogin);

// Función para mostrar los datos personales del usuario logueado.
function datosPersonales() {
   let usuarioLogueado = usersArray[userIndex];
   let message = `
   <div id="datosPersonalesRow"><p>Nombre: </p><p>${usuarioLogueado.nombre} ${usuarioLogueado.apellido}</p></div>
   <div id="datosPersonalesRow"><p>DNI: </p><p>${usuarioLogueado.dni}</p></div>
   <div id="datosPersonalesRow"><p>Fecha de nacimiento: </p><p>${usuarioLogueado.fechaNacimiento}</p></div>
   <div id="datosPersonalesRow"><p>Edad: </p><p>${calcularEdad(usuarioLogueado.fechaNacimiento)}</p></div>
   <div id="datosPersonalesRow"><p>Usuario: </p><p>${usuarioLogueado.usuario}</p></div>`;
   Swal.fire({
      title: 'Datos personales',
      html: message,
      icon: 'info',
      confirmButtonColor: '#000000',
   });
}

// Función para mostrar la suscripción activa del usuario logueado.
function miSuscripcion() {
   let suscripcionActiva = suscripcionesArray[usersArray[userIndex].ultimoNivelSuscripcion];
   Swal.fire({
      title: 'Suscripción activa',
      html: `
      <div id="miSuscripcionRow"><p>Nivel: </p><p>${suscripcionActiva.id}</p></div>
      <div id="miSuscripcionRow"><p>Duración: </p><p>${suscripcionActiva.nombre}</p></div>
      <div id="miSuscripcionRow"><p>Precio: </p><p>$${suscripcionActiva.precio}</p></div>`,
      icon: 'info',
      confirmButtonColor: '#000000',
   });
}

// Función para mostrar la información de contacto.
function infoContacto() {
   Swal.fire({
      title: 'Información de contacto',
      html: '<strong>Correo electrónico:</strong> contacto@codergym.com\n<strong>Teléfono:</strong> +54 9 11 1234-5678',
      icon: 'info',
      confirmButtonColor: '#000000',
   });
}

// Función para mostrar los planes de suscripción disponibles.
function verSuscripciones() {
   let planes = "";
   for (let i = 1; i < suscripcionesArray.length; i++) {
      planes += `
      <div id="planIndividual">
      <p><strong>Nivel:</strong> ${suscripcionesArray[i].id}</p>
      <p><strong>Duración:</strong> ${suscripcionesArray[i].nombre}</p>
      <p><strong>Precio:</strong> $${suscripcionesArray[i].precio}</p>
      </div>`;
   }
   Swal.fire({
      title: 'Planes de suscripción',
      html: planes,
      icon: 'info',
      confirmButtonColor: '#000000',
   });
}


// Función desloguearse e ir al login.
function irALogin() {
   swal.fire({
      title: "¿Seguro que quieres salir?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: '#000000',
      cancelButtonColor: '#505050',
      confirmButtonText: 'Sí',
      cancelButtonText: 'No',
   }).then((result) => {
      if (result.value) {
         localStorage.removeItem("userVerificado");
         localStorage.removeItem("admin");
         localStorage.removeItem("userIndex");
         window.location.href = "../index.html";
      } else {
         return;
      }
   });
}





async function infoNutricional() {
   // Se pide al usuario que ingrese el nombre de la comida
   const comida = await Swal.fire({
      title: 'Ingresa el nombre de la comida',
      input: 'text',
      inputPlaceholder: 'Ej. manzana'
   });
   // Si el usuario presiona cancelar o cierra la alerta, se detiene la función
   if (!comida.value) return;
   // Se realiza la petición a la API con la comida ingresada
   const response = await fetch(`https://api.nal.usda.gov/fdc/v1/search?api_key=ib31wbUa2MgbgDRWEiVRiEcHqaKww6EevqPeM6B8&generalSearchInput=${comida.value}`);
   // Si el codigo de respuesta es distinto a 200 se muestra un mensaje de error
   if (!response.ok) {
      Swal.fire({
         title: 'Error al buscar la comida',
         text: 'No se pudo procesar la solicitud. Intente nuevamente más tarde.',
         icon: 'error',
         confirmButtonColor: '#000000',
      });
      return;
   }
   const data = await response.json();
   // Si no se encuentran resultados, se muestra una alerta al usuario
   if (data.foods.length === 0) {
      Swal.fire({
         title: 'Comida no encontrada',
         text: 'No se encontraron resultados para la comida ingresada.',
         icon: 'warning',
         confirmButtonColor: '#000000',
      });
      return;
   }

   let foodData = data.foods[0];
   let nutrientes = foodData.foodNutrients;

   let message = nutrientes.map(nutrient => {
      return `<div id="nutrienteUnico"><p>${nutrient.nutrientName}: </p><p>${nutrient.value} ${nutrient.unitName}</p></div>`;
   }).join('');

   // Se muestra la información nutricional en una alerta
   Swal.fire({
      title: 'Información nutricional',
      html: message,
      icon: 'info',
      confirmButtonColor: '#000000',
   });
}