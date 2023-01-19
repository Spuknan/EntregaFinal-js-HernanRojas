//Clase usuarios
class Users {
   constructor(id, nombre, apellido, dni, fechaNacimiento, usuario, contrasena, ultimoNivelSuscripcion, ultimaFechaPago, admin) {
      this.id = id;
      this.nombre = nombre;
      this.apellido = apellido;
      this.dni = dni;
      this.fechaNacimiento = fechaNacimiento;
      this.usuario = usuario;
      this.contrasena = contrasena;
      this.ultimoNivelSuscripcion = ultimoNivelSuscripcion;
      this.ultimaFechaPago = ultimaFechaPago;
      this.admin = admin;
   }
}

const usersArray = [
   new Users(0, "admin", "admin", "00.000.000", "01/01/2000", "admin", "admin", 3, "19/01/2023", true),
   new Users(1, "Maria", "Gomez", "37.469.321", "06/11/1994", "mgomez", "1234", 1, "19/12/2022", false),
   new Users(2, "Pedro", "Lopez", "41.647.155", "09/08/1998", "plopez", "1234", 2, "05/9/2022", false),
   new Users(3, "Juana", "Gonzalez", "35.314.885", "01/02/1993", "jgonzalez", "1234", 3, "01/19/2022", false),
   new Users(4, "Jose", "Rodriguez", "39.563.481", "09/05/1996", "jrodriguez", "1234", 3, "01/19/2022", false),
   new Users(5, "Hernán", "Rojas", "39.430.811", "07/02/1996", "hrojas", "1234", 0, false, true)   
];
let userCount = usersArray.length;

// Registrando la base de datos de clientes en el localStorage.
localStorage.setItem('usersArray', JSON.stringify(usersArray));


// Clase suscripciones.
class NivelSuscripcion {
   constructor(id, nombre, duracion, precio) {
      this.id = id;
      this.nombre = nombre;
      this.duracion = duracion;
      this.precio = precio;
   }
}
const nivelSuscripcionArray = [
   new NivelSuscripcion(0, "Deshabilitada", 0, 0),
   new NivelSuscripcion(1, "Mensual", 1, 4500),
   new NivelSuscripcion(2, "Trimestral", 3, 12500),
   new NivelSuscripcion(3, "Anual", 12, 48000)
];
// Registrando la base de datos de suscripciones en el localStorage.
localStorage.setItem('suscripcionesArray', JSON.stringify(nivelSuscripcionArray));


function login() {
   let user = document.getElementById('loginUsername').value;
   let pass = document.getElementById('loginPassword').value;
   let userArray = [user, pass];
   let userFound = false;
   let passFound = false;
   let admin = false;
   let userIndex = usersArray.findIndex(x => x.usuario == user);
   for (let i = 0; i < usersArray.length; i++) {
      if (userArray[0] == usersArray[i].usuario) {
         userFound = true;
         if (userArray[1] == usersArray[i].contrasena) {
            passFound = true;
            if (usersArray[i].admin == true) {
               admin = true;
            }
         }
      }
   }
   if (userFound == false) {
      document.getElementById('loginUsername').style.border = '1px solid #color-error';
      document.getElementById('userErrorMsg').style.display = 'block';
   } else if (passFound == false) {
      document.getElementById('loginPassword').style.border = '1px solid #color-error';
      document.getElementById('passwordErrorMsg').style.display = 'block';
   } else if (admin == true) {
      document.getElementById('loginUsername').style.border = '1px solid #color-success';
      document.getElementById('loginPassword').style.border = '1px solid #color-success';
      localStorage.setItem('userVerificado', true);
      localStorage.setItem('admin', true);
      localStorage.setItem('userIndex', JSON.stringify(userIndex));
      window.location.href = "pages/adminpanel.html";
   } else {
      document.getElementById('loginUsername').style.border = '1px solid #color-success';
      document.getElementById('loginPassword').style.border = '1px solid #color-success';
      localStorage.setItem('userVerificado', true);
      localStorage.setItem('admin', false);
      localStorage.setItem('userIndex', JSON.stringify(userIndex));
      localStorage.removeItem('usersArray');
      window.location.href = "pages/clientpanel.html";
   }
}

// Lanzar la autenticación al tocar 'Ingresar'.
document.getElementById('loginButton').addEventListener('click', login);