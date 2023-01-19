// Retomando datos del localStorage.
let usersArray = JSON.parse(localStorage.getItem('usersArray'));
console.table(usersArray);

let suscripcionesArray = JSON.parse(localStorage.getItem('suscripcionesArray'));
console.table(suscripcionesArray);

const userIndex = JSON.parse(localStorage.getItem('userIndex'));

// Mostrar el nombre de usuario en el panel.
document.getElementById('userNameInfo').innerHTML = "<p>" + usersArray[userIndex].nombre + " " + usersArray[userIndex].apellido + "</p>"

// Funcion para evitar que se pueda ingresar con el link.
function adminLoginVerificacion() {
   if (localStorage.getItem('userVerificado') === 'true' && localStorage.getItem('admin') === 'true') {
      return true
   } else if (localStorage.getItem('userVerificado') === 'true' && localStorage.getItem('admin') === 'false') {
      window.location.href = "clientpanel.html";
   } else {
      window.location.href = "index.html";
   }
}
adminLoginVerificacion();

document.getElementById("todosLosClientes").addEventListener("click", todosLosClientes);
document.getElementById("buscarCliente").addEventListener("click", buscarCliente);
document.getElementById("proximosVencimientos").addEventListener("click", proximosVencimientos);
document.getElementById("clientesAtrasados").addEventListener("click", clientesAtrasados);
document.getElementById("verSuscripciones").addEventListener("click", verSuscripciones);
document.getElementById("actualizarPrecios").addEventListener("click", actualizarPrecios);
document.getElementById("crearUsuario").addEventListener("click", crearUsuario);
document.getElementById("irALogin").addEventListener("click", irALogin);





// Funcion para crear nuevos usuarios.
function crearUsuario() {
   // Mostrar alerta para ingresar los datos del nuevo usuario
   Swal.fire({
      title: 'Agregar nuevo usuario',
      html: `
      <div id="agregarUsuarioForm">
      <div><label for="nombre">Nombre:
      <input id="nombre" placeholder="Nombre" class="swal2-input"></div>
      <div><label for="apellido">Apellido:
      <input id="apellido" placeholder="Apellido" class="swal2-input"></div>
      <div><label for="DNI">DNI:
      <input id="dni" placeholder="DNI" class="swal2-input"></div>
      <div><label for="fechaNacimiento">Fecha de nacimiento:
      <input type="date" id="fechaNacimiento" placeholder="Fecha de nacimiento (dd/mm/yyyy)" class="swal2-input"></div>
      <div><label for="usuario">Nombre de usuario
      <input id="usuario" placeholder="Usuario" class="swal2-input"></div>
      <div><label for="contrasena">Contraseña:
      <input id="contrasena" placeholder="Contraseña" class="swal2-input"></div>
      <div><label for="ultimoNivelSuscripcion">Suscripcion:
      <input type="date" id="ultimoNivelSuscripcion" placeholder="Último nivel de suscripción (0, 1, 2, 3)" class="swal2-input"></div>
      <div><label for="ultimaFechaPago">Fecha de pago:
      <input type="date" id="ultimaFechaPago" placeholder="Última fecha de pago (dd/mm/yyyy)" class="swal2-input"></div>
      <div><label>Es administrador:</label>
      <input id="admin" type="checkbox" class="swal2-checkbox"></div>
      </div>
     `,
      showCancelButton: true,
      confirmButtonText: 'Agregar',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
         return {
            nombre: document.getElementById('nombre').value,
            apellido: document.getElementById('apellido').value,
            dni: document.getElementById('dni').value,
            fechaNacimiento: document.getElementById('fechaNacimiento').value,
            usuario: document.getElementById('usuario').value,
            contrasena: document.getElementById('contrasena').value,
            ultimoNivelSuscripcion: document.getElementById('ultimoNivelSuscripcion').value,
            ultimaFechaPago: document.getElementById('ultimaFechaPago').value,
            admin: document.getElementById('admin').checked //<-- changed from .value to .checked
         }
      }
   }).then((result) => {
      if (result.value) {
         // Obtener el próximo ID para el nuevo usuario
         let nextId = usersArray.length;

         // Verificar si el usuario ya existe
         let existingUser = usersArray.find(user => user.usuario === result.value.usuario);

         if (existingUser) {
            // Mostrar mensaje de error si el usuario ya existe
            Swal.fire({
               title: 'Error',
               text: 'El usuario ya existe, por favor elija otro',
               icon: 'error'
            });
         } else {
            // Agregar el nuevo usuario al array de usuarios
            usersArray.push({
               id: nextId,
               nombre: result.value.nombre,
               apellido: result.value.apellido,
               dni: result.value.dni,
               fechaNacimiento: result.value.fechaNacimiento,
               usuario: result.value.usuario,
               contrasena: result.value.contrasena,
               ultimoNivelSuscripcion: result.value.ultimoNivelSuscripcion,
               ultimaFechaPago: result.value.ultimaFechaPago,
               admin: result.value.admin
            });

            // Actualizar el localStorage con el nuevo array de usuarios
            localStorage.setItem('usersArray', JSON.stringify(usersArray));
            // Mostrar mensaje de éxito
            Swal.fire({
               title: 'Usuario agregado',
               text: 'El usuario ha sido agregado exitosamente',
               icon: 'success',
               confirmButtonText: 'OK'
            });
         }
      }
   });
}



// Funcion para ver clientes atrasados.
function clientesAtrasados() {
   let clientesAtrasados = [];
   let hoy = new Date();
   for (let i = 0; i < usersArray.length; i++) {
      let fechaVencimiento = new Date(usersArray[i].ultimaFechaPago);
      fechaVencimiento.setMonth(fechaVencimiento.getMonth() + suscripcionesArray[usersArray[i].ultimoNivelSuscripcion].duracion);
      if (hoy > fechaVencimiento) {
         clientesAtrasados.push(usersArray[i].nombre + ' ' + usersArray[i].apellido);
      }
   }
   if (clientesAtrasados.length > 0) {
      Swal.fire({
         title: 'Clientes con suscripciones vencidas',
         text: clientesAtrasados.join(', '),
         icon: 'warning',
         confirmButtonText: 'Ok'
      });
   } else {
      Swal.fire({
         title: 'No hay clientes con suscripciones vencidas',
         icon: 'info',
         confirmButtonText: 'Ok'
      });
   }
}


// Funcion para ver suscripciones.
function verSuscripciones() {
   let suscripciones = JSON.parse(localStorage.getItem('suscripcionesArray'));
   let contenidoTabla = "";
   for (let i = 0; i < suscripciones.length; i++) {
      contenidoTabla +=
         "<tr>" +
         "<td>" + suscripciones[i].id + "</td>" +
         "<td>" + suscripciones[i].nombre + "</td>" +
         "<td>" + suscripciones[i].duracion + " meses</td>" +
         "<td>" + suscripciones[i].precio + "</td>" +
         "</tr>";
   }
   Swal.fire({
      title: "Suscripciones",
      html:
         "<table>" +
         "<thead>" +
         "<tr>" +
         "<th>ID</th>" +
         "<th>Nombre</th>" +
         "<th>Duración</th>" +
         "<th>Precio</th>" +
         "</tr>" +
         "</thead>" +
         "<tbody>" +
         contenidoTabla +
         "</tbody>" +
         "</table>",
      confirmButtonText: "Aceptar",
   });
}


// Funcion actualizar precios.
function actualizarPrecios() {
   Swal.fire({
      title: 'Actualizar precios',
      html:
         '<div class="form-group">' +
         '<label for="suscripcion1">Mensual</label>' +
         '<input type="radio" id="suscripcion1" name="suscripcionCheckbox" value="1">' +
         '</div>' +
         '<div class="form-group">' +
         '<label for="suscripcion2">Trimestral</label>' +
         '<input type="radio" id="suscripcion2" name="suscripcionCheckbox" value="2">' +
         '</div>' +
         '<div class="form-group">' +
         '<label for="suscripcion3">Anual</label>' +
         '<input type="radio" id="suscripcion3" name="suscripcionCheckbox" value="3">' +
         '</div>' +
         '<div class="form-group">' +
         '<label for="nuevoPrecio">Nuevo precio:</label>' +
         '<input id="nuevoPrecio" type="number" min="0">' +
         '</div>',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
   }).then((result) => {
      if (result.value) {
         let nuevoPrecio = document.getElementById('nuevoPrecio').value;
         let suscripcionSeleccionada = document.querySelector('input[name="suscripcionCheckbox"]:checked').value;
         suscripcionesArray[suscripcionSeleccionada].precio = nuevoPrecio;
         localStorage.setItem('suscripcionesArray', JSON.stringify(suscripcionesArray));
         Swal.fire({
            title: 'Precios actualizados',
            text: 'Los precios de las suscripciones seleccionadas se han actualizado con éxito.',
            icon: 'success'
         });
      }
   });
}


// Funcion para mostrar proximos vencimientos.
function proximosVencimientos() {
   let proximosVencimientosArray = [];
   let hoy = new Date();
   let fechaVencimiento;
   for (let i = 0; i < usersArray.length; i++) {
      fechaVencimiento = new Date(usersArray[i].ultimaFechaPago);
      fechaVencimiento.setMonth(fechaVencimiento.getMonth() + suscripcionesArray[usersArray[i].ultimoNivelSuscripcion].duracion);
      if (fechaVencimiento > hoy) {
         proximosVencimientosArray.push(usersArray[i]);
      }
   }
   if (proximosVencimientosArray.length > 0) {
      let message = "Los siguientes clientes tienen suscripciones próximas a vencer: <br>";
      for (let i = 0; i < proximosVencimientosArray.length; i++) {
         message += `- ${proximosVencimientosArray[i].nombre} ${proximosVencimientosArray[i].apellido} - <br>`;
      }
      Swal.fire({
         title: 'Próximos vencimientos',
         html: message,
         icon: 'info'
      });
   } else {
      Swal.fire({
         title: 'Próximos vencimientos',
         text: 'Actualmente no hay suscripciones próximas a vencer.',
         icon: 'info'
      });
   }
}


// Funcion para buscar un cliente especifico.
function buscarCliente() {
   swal.fire({
      title: 'Ingrese el parámetro de búsqueda',
      input: 'select',
      inputOptions: {
         nombre: 'Nombre',
         apellido: 'Apellido',
         dni: 'DNI',
         usuario: 'Usuario'
      },
      showCancelButton: true,
      confirmButtonText: 'Siguiente',
      preConfirm: (parametro) => {
         return swal.fire({
            title: 'Ingrese el valor a buscar',
            input: 'text',
            inputAttributes: {
               autocapitalize: 'off'
            },
            showCancelButton: true,
            confirmButtonText: 'Buscar',
            preConfirm: (valor) => {
               let clientesEncontrados = [];
               for (let i = 0; i < usersArray.length; i++) {
                  if (usersArray[i][parametro] === valor) {
                     clientesEncontrados.push(usersArray[i]);
                  }
               }
               if (clientesEncontrados.length === 0) {
                  swal.fire({
                     icon: 'error',
                     title: 'No se encontraron clientes con ese valor',
                     confirmButtonColor: '#000000'
                  });
                  return false;
               }
               else {
                  let clientes = "";
                  for (let i = 0; i < clientesEncontrados.length; i++) {
                     clientes += `<div id="usuarioIndividual"> <p>Nombre: ${clientesEncontrados[i].nombre} ${clientesEncontrados[i].apellido}</p> <p>DNI: ${clientesEncontrados[i].dni}</p> <p>Edad: ${calcularEdad(clientesEncontrados[i].fechaNacimiento)}</p> <p>Usuario: ${clientesEncontrados[i].usuario}</p> <p>Estado de la suscripcion: ${validarSuscripcion(clientesEncontrados[i].id)}</p> </div>`;
                  }
                  Swal.fire({
                     title: "Clientes encontrados",
                     html: `${clientes}`,
                     confirmButtonText: 'Ok',
                     confirmButtonColor: '#000000'
                  });
               }
            },
            allowOutsideClick: () => !swal.isLoading()
         });
      },
      allowOutsideClick: () => !swal.isLoading()
   });
}


// Funcion para ver todos los clientes.
function todosLosClientes() {
   let clientes = "";
   for (let i = 0; i < usersArray.length; i++) {
      clientes += `<div id="usuarioIndividual">
      <p>Nombre: ${usersArray[i].nombre} ${usersArray[i].apellido}</p>
      <p>DNI: ${usersArray[i].dni}</p>
      <p>Edad: ${calcularEdad(usersArray[i].fechaNacimiento)}</p>
      <p>Usuario: ${usersArray[i].usuario}</p>
      <p>Estado de la suscripcion: ${validarSuscripcion(usersArray[i].id)}</p>
      </div>`;
   }
   Swal.fire({
      title: 'Todos los clientes',
      html: `${clientes}`,
      confirmButtonText: 'Ok',
      confirmButtonColor: '#000000'
   });
}


// Función desloguearse e ir al login.
function irALogin() {
   swal.fire({
      title: "¿Seguro que quieres salir?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
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


function validarSuscripcion(id) {
   // encontrar el usuario en el array de usuarios
   let usuario = usersArray.find(x => x.id == id);
   // obtener la fecha de último pago y nivel de suscripción del usuario
   let ultimaFechaPago = usuario.ultimaFechaPago;
   let nivelSuscripcion = usuario.ultimoNivelSuscripcion;
   // si el usuario no tiene una fecha de último pago registrada, devolver "inactiva"
   if (!ultimaFechaPago) {
      return "inactiva";
   }
   // si el usuario tiene una fecha de último pago registrada, calcular la fecha de vencimiento
   let duracionSuscripcion = suscripcionesArray[nivelSuscripcion].duracion;
   let fechaVencimiento = new Date(ultimaFechaPago);
   fechaVencimiento.setMonth(fechaVencimiento.getMonth() + duracionSuscripcion);
   // si la fecha actual es anterior a la fecha de vencimiento, devolver "activa"
   if (new Date() < fechaVencimiento) {
      return "activa";
   } else {
      return "inactiva";
   }
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
//setInterval(checkInactividad, 60000);

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