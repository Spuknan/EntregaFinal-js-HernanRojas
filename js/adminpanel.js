// Retomando datos del localStorage.
const usersArray = JSON.parse(localStorage.getItem('usersArray'));
console.table(usersArray);

const suscripcionesArray = JSON.parse(localStorage.getItem('suscripcionesArray'));
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
//document.getElementById("clientesAtrasados").addEventListener("click", clientesAtrasados);
//document.getElementById("verSuscripciones").addEventListener("click", verSuscripciones);
//document.getElementById("actualizarPrecios").addEventListener("click", actualizarPrecios);
//document.getElementById("crearUsuario").addEventListener("click", crearUsuario);
document.getElementById("irALogin").addEventListener("click", irALogin);


// Funcion para mostrar proximos vencimientos.
function proximosVencimientos() {
   let usuariosVencimiento = [];
   for (let i = 0; i < usersArray.length; i++) {
      let fechaVencimiento = dayjs(usersArray[i].ultimaFechaPago).add(suscripcionesArray[usersArray[i].ultimoNivelSuscripcion].duracion, 'month');
      let hoy = dayjs();
      let proximoVencimiento = fechaVencimiento.subtract(14, 'day'); // 14 dias antes del vencimiento
      if (proximoVencimiento.isBefore(hoy)) {
         usuariosVencimiento.push(usersArray[i]);
      }
   }
   if (usuariosVencimiento.length === 0) {
      swal.fire({
         title: "No hay suscripciones próximas a vencer",
         confirmButtonText: 'Ok',
         confirmButtonColor: '#000000'
      });
   }
   else {
      let usuarios = "";
      for (let i = 0; i < usersArray.length; i++) {
         let fechaVencimiento = dayjs(validarSuscripcion(usersArray[i].id));
         let hoy = dayjs();
         let unaSemana = dayjs().add(14, 'day');
         if (fechaVencimiento.isBefore(unaSemana) && fechaVencimiento.isAfter(hoy)) {
            usuarios += `<div id="usuarioIndividual">
               <p>Nombre: ${usersArray[i].nombre} ${usersArray[i].apellido}</p>
               <p>DNI: ${usersArray[i].dni}</p>
               <p>Usuario: ${usersArray[i].usuario}</p>
               <p>Fecha de vencimiento: ${fechaVencimiento.format('DD/MM/YYYY')}</p>
            </div>`;
         }
      }
      if (usuarios === "") {
         swal.fire({
            title: "No hay suscripciones próximas a vencer",
            confirmButtonText: 'Ok',
            confirmButtonColor: '#000000'
         });
      } else {
         Swal.fire({
            html: `${ usuarios }`,
            confirmButtonText: 'Ok',
            confirmButtonColor: '#000000'
         });
      }
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
         console.log("Usuario seleccionó sí");
         localStorage.removeItem("userVerificado");
         localStorage.removeItem("admin");
         localStorage.removeItem("userIndex");
         window.location.href = "../index.html";
      } else {
         console.log("Usuario seleccionó no")
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