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
         <div class="agregarUsuarioGroup">
            <div><label for="nombre">Nombre:</div>
            <div><input id="nombre" class="swal2-input"></div>
         </div>
         <div class="agregarUsuarioGroup">
            <div><label for="apellido">Apellido:</div>
            <div><input id="apellido" class="swal2-input"></div>
         </div>
         <div class="agregarUsuarioGroup">
            <div><label for="DNI">DNI:</div>
            <div><input id="dni" class="swal2-input"></div>
         </div>
         <div class="agregarUsuarioGroup">
            <div><label for="fechaNacimiento">Fecha de nacimiento:</div>
            <div><input type="date" id="fechaNacimiento" class="swal2-input"></div>
         </div>
         <div class="agregarUsuarioGroup">
            <div><label for="usuario">Nombre de usuario</div>
            <div><input id="usuario"" class="swal2-input"></div>
         </div>
         <div class="agregarUsuarioGroup">
            <div><label for="contrasena">Contraseña:</div>
            <div><input id="contrasena" class="swal2-input"></div>
         </div>
         <div class="agregarUsuarioGroup">
            <div><label for="ultimoNivelSuscripcion">Suscripcion:</div>
            <div><input type="number" id="ultimoNivelSuscripcion" class="swal2-input" min="0" max="3"></div>
         </div>
         <div class="agregarUsuarioGroup">
            <div><label for="ultimaFechaPago">Fecha de pago:</div>
            <div><input type="date" id="ultimaFechaPago" class="swal2-input"> </div>
         </div>
         <div class="agregarUsuarioGroup">
            <div><label>Es administrador:</label></div>
            <div><input id="admin" type="checkbox" class="swal2-checkbox"></div>
         </div>
      </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Agregar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#000000',
      cancelButtonColor: '#505050',
      preConfirm: () => {
         return {
            nombre: document.getElementById('nombre').value,
            apellido: document.getElementById('apellido').value,
            dni: document.getElementById('dni').value,
            fechaNacimiento: dayjs(document.getElementById('fechaNacimiento').value).format('MM/DD/YYYY'),
            usuario: document.getElementById('usuario').value,
            contrasena: document.getElementById('contrasena').value,
            ultimoNivelSuscripcion: document.getElementById('ultimoNivelSuscripcion').value,
            ultimaFechaPago: dayjs(document.getElementById('ultimaFechaPago').value).format('MM/DD/YYYY'),
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
               icon: 'error',
               confirmButtonColor: '#000000'
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
               confirmButtonText: 'OK',
               confirmButtonColor: '#000000'
            });
            console.table(usersArray);
         }
      }
   });
}



// Funcion para ver clientes atrasados.
function clientesAtrasados() {
   let clientesInactivos = [];
   for (let i = 0; i < usersArray.length; i++) {
      let estadoSuscripcion = validarSuscripcion(i);
      if (estadoSuscripcion === "Inactiva") {
         clientesInactivos.push(usersArray[i].nombre);
      }
   }
   if (clientesInactivos.length > 0) {
      Swal.fire({
         title: 'Clientes con suscripciones inactivas',
         text: clientesInactivos.join(', '),
         icon: 'warning',
         confirmButtonColor: '#000000'
      })
   } else {
      Swal.fire({
         title: 'Todas las suscripciones están activas',
         icon: 'success',
         confirmButtonColor: '#000000'
      })
   }
}


// Funcion para ver suscripciones.
function verSuscripciones() {
   let suscripciones = JSON.parse(localStorage.getItem('suscripcionesArray'));
   let contenidoLista = "";
   for (let i = 1; i < suscripciones.length; i++) {
      contenidoLista +=
         "<li>" +
         "<div id='listaSubsRow'><p>ID: </p><p>" + suscripciones[i].id + "</p></div>" +
         "<div id='listaSubsRow'><p>Nombre: </p><p>" + suscripciones[i].nombre + "</p></div>" +
         "<div id='listaSubsRow'><p>Duración: </p><p>" + suscripciones[i].duracion + " meses</p></div>" +
         "<div id='listaSubsRow'><p>Precio: </p><p>$" + suscripciones[i].precio + "</p></div>" +
         "</li>";
   }
   Swal.fire({
      title: "Suscripciones",
      html:
         "<ul id='contenidoListaUl'>" +
         contenidoLista +
         "</ul>",
      confirmButtonText: "Aceptar",
      confirmButtonColor: '#000000',
   });
}


// Funcion actualizar precios.
function actualizarPrecios() {
   Swal.fire({
      title: 'Actualizar precios',
      html:
         '<div id="actualizarPreciosItem">' +

         '<div class="radioButtons">' +
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
         '</div>' +

         '<div class="form-group inputNuevoPrecio">' +
         '<label for="nuevoPrecio">Nuevo precio:</label>' +
         '<input id="nuevoPrecio" type="number" min="0">' +
         '</div>' +

         '</div>',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#000000',
   }).then((result) => {
      if (result.value) {
         let nuevoPrecio = document.getElementById('nuevoPrecio').value;
         let suscripcionSeleccionada = document.querySelector('input[name="suscripcionCheckbox"]:checked').value;
         suscripcionesArray[suscripcionSeleccionada].precio = nuevoPrecio;
         localStorage.setItem('suscripcionesArray', JSON.stringify(suscripcionesArray));
         Swal.fire({
            title: 'Precios actualizados',
            text: 'Los precios de las suscripciones seleccionadas se han actualizado con éxito.',
            icon: 'success',
            confirmButtonColor: '#000000'
         });
      }
   });
}


// Funcion para mostrar proximos vencimientos.
function proximosVencimientos() {
   let suscripcionesProximasAVencer = [];
   // Recuperar los datos de los usuarios y suscripciones del localStorage
   let usersArray = JSON.parse(localStorage.getItem('usersArray'));
   let suscripcionesArray = JSON.parse(localStorage.getItem('suscripcionesArray'));
   // Iterar a través de los usuarios
   for (let i = 0; i < usersArray.length; i++) {
      // Obtener la suscripción del usuario
      let suscripcion = usersArray[i].ultimoNivelSuscripcion;
      // Crear una variable para la fecha de pago
      let fechaDePago = usersArray[i].ultimaFechaPago;
      // Si el usuario no tiene una fecha de pago registrada, continuar con el siguiente usuario
      if (!fechaDePago) {
         continue;
      }
      // Crear una variable para la fecha de vencimiento (suma de fecha de pago + duración de suscripción en meses)
      let fechaVencimiento = dayjs(fechaDePago).add(suscripcionesArray[suscripcion].duracion, 'month');
      // Crear una variable para la fecha actual
      let fechaActual = dayjs();
      // Calcular la diferencia entre la fecha actual y la fecha de vencimiento en días
      let diferenciaEnDias = fechaVencimiento.diff(fechaActual, 'day');
      // Si la diferencia es menor o igual a 14, agregar el usuario al arreglo de suscripcionesProximasAVencer
      if (diferenciaEnDias <= 14 && fechaActual < fechaVencimiento) {
         usersArray[i].fechaVencimiento = fechaVencimiento.format('DD/MM/YYYY');
         suscripcionesProximasAVencer.push(usersArray[i]);
      }
   }
   if (suscripcionesProximasAVencer.length > 0) {
      let listaUsuarios = "";
      for (let i = 0; i < suscripcionesProximasAVencer.length; i++) {
         listaUsuarios += `
         <div id="usuarioVencimientoIndividual">
            <ul>
               <li> <strong>Usuario:</strong></li>
               <li> ${suscripcionesProximasAVencer[i].nombre} ${suscripcionesProximasAVencer[i].apellido}</li>
               <li> <strong>Fecha de vencimiento:</strong></li>
               <li>${suscripcionesProximasAVencer[i].fechaVencimiento}</li>
            </ul>
         </div>`
      }
      Swal.fire({
         title: 'Suscripciones próximas a vencer',
         html: '<ul>' + listaUsuarios + '</ul>',
         icon: 'info',
         confirmButtonColor: '#000000'
      });
   } else {
      Swal.fire({
         title: 'No hay suscripciones próximas a vencer',
         text: 'Todas las suscripciones están al día.',
         icon: 'info',
         confirmButtonColor: '#000000'
      });
   }
}


function validarSuscripcion(userId) {
   // Obtener el usuario específico
   let usuarioBuscado = usersArray[userId];
   console.log("Usuario buscado: " + usuarioBuscado.nombre);
   // Obtener la suscripción del usuario
   let suscripcion = usersArray[userId].ultimoNivelSuscripcion;
   console.log("Nivel de suscripcion: " + suscripcion);
   // Crear una variable para la fecha de pago
   let fechaDePago = usuarioBuscado.ultimaFechaPago;
   console.log("Ultima fecha de pago: " + fechaDePago);

   if (!fechaDePago) {
      return "Inactiva";
   }
   // Crear una variable para la fecha de vencimiento (suma de fecha de pago + duración de suscripción en meses)
   let fechaVencimiento = dayjs(fechaDePago).add(suscripcionesArray[suscripcion].duracion, 'month').format('DD/MM/YYYY');
   console.log("Fecha de vencimiento: " + fechaVencimiento);
   // Crear una variable para la fecha actual
   let fechaActual = dayjs();
   console.log("Fecha Actual: ", fechaActual);

   if (dayjs(fechaVencimiento).isBefore(fechaActual)) {
      return "Inactiva";
   } else {
      return "Activa";
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
      confirmButtonColor: '#000000',
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
            confirmButtonColor: '#000000',
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
                     clientes += `
                     <div id="usuarioIndividual">
                     <div id="usuarioIndividualRow">
                        <p><strong>Nombre:</strong></p>
                        <p> ${clientesEncontrados[i].nombre} ${clientesEncontrados[i].apellido}</p>
                     </div>

                     <div id="usuarioIndividualRow">
                        <p><strong>DNI:</strong></p>
                        <p> ${clientesEncontrados[i].dni}</p>
                     </div>

                     <div id="usuarioIndividualRow">
                        <p><strong>Edad:</strong></p>
                        <p> ${calcularEdad(clientesEncontrados[i].fechaNacimiento)}</p>
                     </div>

                     <div id="usuarioIndividualRow">
                        <p><strong>Usuario:</strong></p>
                        <p> ${clientesEncontrados[i].usuario}</p>
                     </div>

                     <div id="usuarioIndividualRow">
                        <p><strong>Estado de la suscripcion:</strong></p>
                        <p> ${validarSuscripcion(clientesEncontrados[i].id)}</p>
                     </div>

                     </div>`;
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
      <div id="usuarioIndividualRow"><p><strong>Nombre:</strong></p><p> ${usersArray[i].nombre} ${usersArray[i].apellido}</p></div>
      
      <div id="usuarioIndividualRow"><p><strong>DNI:</strong></p><p> ${usersArray[i].dni}</p></div>
      
      <div id="usuarioIndividualRow"><p><strong>Edad:</strong></p><p> ${calcularEdad(usersArray[i].fechaNacimiento)}</p></div>
      
      <div id="usuarioIndividualRow"><p><strong>Usuario:</strong></p><p> ${usersArray[i].usuario}</p></div>
      
      <div id="usuarioIndividualRow"><p><strong>Estado de la suscripcion:</strong></p><p> ${validarSuscripcion(usersArray[i].id)}</p></div>
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