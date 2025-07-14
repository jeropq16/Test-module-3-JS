// --- EVENTOS ---
// Suponiendo que hay una tabla de eventos y un formulario para agregar eventos
const API_URL_EVENTOS = "http://localhost:3000/eventos";

// Mostrar eventos en tabla para admin
function tablaEventosAdmin() {
    fetch(API_URL_EVENTOS)
        .then(res => res.json())
        .then(data => {
            const tbody = document.getElementById('tabla-admin-eventos');
            if (!tbody) return;
            tbody.innerHTML = "";
            data.forEach(evento => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${evento.id}</td>
                    <td>${evento.nombre}</td>
                    <td>${evento.capacidad || '-'}</td>
                    <td>${evento.fecha}</td>
                    <td>
                        <button class="buttonDisplay" onclick="eliminarEvento(${evento.id})">Eliminar</button>
                    </td>
                `;
                tbody.appendChild(row);
            });
        });
}

// Mostrar eventos en tabla para usuario
function tablaEventosUsuario() {
    fetch(API_URL_EVENTOS)
        .then(res => res.json())
        .then(data => {
            const tbody = document.getElementById('tabla-user-eventos');
            if (!tbody) return;
            tbody.innerHTML = "";
            data.forEach(evento => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${evento.id}</td>
                    <td>${evento.nombre}</td>
                    <td>${evento.fecha}</td>
                    <td>${evento.capacidad || '-'}</td>
                `;
                tbody.appendChild(row);
            });
        });
}

// Eliminar evento (solo admin)
window.eliminarEvento = function(id) {
    if (confirm("¿Deseas eliminar este evento?")) {
        fetch(`${API_URL_EVENTOS}/${id}`, { method: "DELETE" })
            .then(() => tablaEventosAdmin())
            .catch(() => alert("Error al eliminar evento"));
    }
}

// Formulario para agregar evento (solo admin)
function setupAgregarEvento() {
    const formEvento = document.getElementById('form-evento');
    if (!formEvento) return;

    formEvento.addEventListener('submit', async (e) => {
        e.preventDefault();
        const nombre = document.getElementById('nombreEvento')?.value;
        const capacidad = document.getElementById('capacidadEvento')?.value;
        const fecha = document.getElementById('fechaEvento')?.value;

        if (!nombre || !capacidad || !fecha) {
            alert('Completa todos los campos del evento.');
            return;
        }

        const nuevoEvento = { nombre, capacidad: Number(capacidad), fecha };
        try {
            await fetch(API_URL_EVENTOS, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(nuevoEvento)
            });
            alert('Evento agregado con éxito');
            formEvento.reset();
            tablaEventosAdmin();
        } catch (err) {
            alert('Error al agregar evento');
        }
    });
}
function setupAgregarEvento() {
    const formEvento = document.getElementById('form-evento');
    if (!formEvento) return;

    formEvento.addEventListener('submit', async (e) => {
        e.preventDefault();
        const nombre = document.getElementById('nombreEvento')?.value;
        const fecha = document.getElementById('fechaEvento')?.value;
        const descripcion = document.getElementById('descripcionEvento')?.value;

        if (!nombre || !fecha || !descripcion) {
            alert('Completa todos los campos del evento.');
            return;
        }

        const nuevoEvento = { nombre, fecha, descripcion };
        try {
            await fetch(API_URL_EVENTOS, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(nuevoEvento)
            });
            alert('Evento agregado con éxito');
            formEvento.reset();
            tablaEventos();
        } catch (err) {
            alert('Error al agregar evento');
        }
    });
}

// Mostrar eventos en tabla (si existe la tabla)
function tablaEventos() {
    fetch(API_URL_EVENTOS)
        .then(res => res.json())
        .then(data => {
            const tbody = document.getElementById('tabla-eventos');
            if (!tbody) return;
            tbody.innerHTML = "";
            data.forEach(evento => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${evento.id}</td>
                    <td>${evento.nombre}</td>
                    <td>${evento.fecha}</td>
                    <td>${evento.descripcion}</td>
                `;
                tbody.appendChild(row);
            });
        });
}
const API_URL_USUARIOS = "http://localhost:3000/usuarios"
const API_URL_RESERVAS = "http://localhost:3000/reservas"
const API_URL_LIBROS = "http://localhost:3000/libros"

const routes = {
    '#/': 'vistas/login.html',
    '#/registro': 'vistas/formRegistro.html',
    '#/admin': 'vistas/admin.html',
    '#/usuario': 'vistas/usuario.html',
    '#/formAgregar': 'vistas/formAgregar.html',
    '#/formModificar': 'vistas/formModificar.html'
}

function login(){
    const result = localStorage.getItem("Login") || null;
    const resultBool = result == "true"
    return resultBool;
}

function isAdmin(){
    const result = localStorage.getItem("role") || null;
    const resultAdmin = result == "admin"
    return resultAdmin;
}

function isUser(){
    const result = localStorage.getItem("role") || null;
    const resultUser = result == "usuario"
    return resultUser;
}

// Función asincrónica para renderizar la vista según el hash actual de la URL
async function renderRoute() {

    // Eliminar redirección automática de usuario/admin para permitir volver al login
    // if(isUser()){
    //     location.hash = '#/usuario'
    // }

    // if (isAdmin()) {
    //     console.log(location.hash)
    //     const rutasProhibidasParaAdmin = ['#/usuario', '#/', '#/registro', '#/formRegistro'];
    //     if (rutasProhibidasParaAdmin.includes(location.hash)) {
    //         location.hash = '#/admin';
    //     }
    // }

    // Obtiene el hash actual de la URL. Si no hay hash, usa '#/' que representa la página de inicio
    const path = location.hash || '#/';

    const rutasPublicas = ['#/', '#/registro'];

    if (!login() && !rutasPublicas.includes(path)) {
        location.hash = '#/';
        return;
    }

    // Busca el archivo HTML correspondiente a esa ruta. Si no existe, intentamos cargar una vista 404 (no encontrada)
    const archivo = routes[path];

    try {
        // Usa fetch para solicitar el archivo HTML dinámicamente
        const res = await fetch(archivo);

        // Si la respuesta no es exitosa (ej. 404), lanzamos un error para manejarlo en el catch
        if (!res.ok) throw new Error('Archivo no encontrado');

        // Extraemos el texto HTML de la respuesta
        const html = await res.text();

        // Insertamos el contenido HTML en el contenedor principal de la página
        document.getElementById('contenedor-index').innerHTML = html;

        //logica para login segun el rol
        if (path === "#/") setupLoginForm();
        if (path === "#/registro") setupRegistro();

        if (path === "#/usuario") {
            tablaUserLibros();
            mostrarTodasLasReservas();
            tablaEventosUsuario();
        }

        if (path === "#/formAgregar") {
            setupAgregar();
            setupAgregarEvento();
        }
        if (path === "#/admin") {
            tablaAdminLibros();
            tablaAdminReserva();
            tablaAdminUsuario();
            tablaEventosAdmin();
        }
        if (path === "#/admin" || path === "#/usuario") cerrarSesion ();

    } catch (e) {
        // En caso de error (fetch fallido o archivo no encontrado), mostramos un mensaje simple en pantalla
        document.getElementById('contenedor-index').innerHTML = '<h1>Error cargando la vista</h1>';

        // También imprimimos el error en consola para desarrollo
        console.error(e);
    }

}

function onNavClick(e) {
    const link = e.target.closest('[data-link]');
    if (link) {
        e.preventDefault();
        const path = link.getAttribute('href');
        location.hash = path;
    }
}

// function setupModificar(){
//     const formModificar = document.getElementById('form-modificar');
// }

function setupAgregar(){
    const formAgregar = document.getElementById('form-evento');
    if (!formAgregar) return;

    formAgregar.addEventListener('submit', async (e) => {
        e.preventDefault();

        const nombre = document.getElementById('nombreEvento')?.value;
        const capacidad = document.getElementById('capacidadEvento')?.value;
        const fecha = document.getElementById('fechaEvento')?.value;

        if (!nombre || !capacidad || !fecha) {
            alert('Completa todos los campos del evento.');
            return;
        }

        const nuevoEvento = {
            nombre: nombre,
            capacidad: Number(capacidad),
            fecha: fecha
        };

        try {
            await fetch(API_URL_EVENTOS, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(nuevoEvento)
            });
            alert('Evento agregado con éxito');
            formAgregar.reset();
            if (typeof tablaEventosAdmin === 'function') tablaEventosAdmin();
        } catch (error) {
            alert('Error al agregar el evento');
        }
    });
}

function setupRegistro() {
    const formRegistro = document.getElementById('form-registro');

    formRegistro.addEventListener('submit', async (e) => {
        e.preventDefault();

        const nombreRe = document.getElementById('nombreRegistro').value;
        const correoRe = document.getElementById('correoRegistro').value;
        const contraseñaRe = document.getElementById('contraseñaRegistro').value;
        const rolRe = document.getElementById('roleRegistro').value;

        const newUser = {
            nombre: nombreRe,
            correo: correoRe,
            contraseña: contraseñaRe,
            role: rolRe
        };

        fetch(API_URL_USUARIOS, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newUser)
        })
        .then(res => res.json())
        .then(data => {
            console.log("Usuario agregado con éxito:", data);
            formRegistro.reset();
            location.hash = "#/";  
        })
        .catch(error => console.error("Error al agregar usuario:", error));
    });
}



function setupLoginForm(){
    const formLogin = document.getElementById('form-login');
    if (!formLogin) {
        console.error('No se encontró el formulario de login (form-login)');
        return;
    }

    formLogin.addEventListener('submit', async (e) => {
        e.preventDefault();

        const user = document.getElementById('usuarioLogin')?.value;
        const pass = document.getElementById('contraseñaLogin')?.value;

        if (!user || !pass) {
            alert('Por favor, completa todos los campos.');
            return;
        }

        // Hacer petición a la base de datos para traer los usuarios
        const users = await getUsers();

        // Buscar usuario que coincida
        const foundUser = users.find(
            (userDB) => userDB.nombre == user && String(userDB.contraseña) == pass
        );

        if (foundUser) {
            localStorage.setItem("Login", "true");
            localStorage.setItem("role", foundUser.role);
            if(foundUser.role == "usuario"){
                location.hash = "#/usuario";
            } else{
                location.hash = "#/admin";
            }
        } else {
            alert("usuario o contraseña son incorrectos");
        }
    });
}

//funcion para hacer la peticion y traer usuarios
async function getUsers() {
    const res = await fetch(API_URL_USUARIOS);
    const data = await res.json();
    return data;
}

//funcion para cerrar sesion
function cerrarSesion (){
    const buttonClose = document.getElementById('close-sesion');

    buttonClose.addEventListener('click', () => {
        localStorage.setItem("Login", "false")
        localStorage.removeItem("role")
        location.hash = "#/";
    })
}

//vista de admin vamos a mostrar distintas tablas books, user, reservation
function tablaAdminUsuario(){
    fetch(API_URL_USUARIOS)
        .then(res => res.json())
        .then(data => {
            const tbody = document.getElementById('tabla-admin-usuarios');
            tbody.innerHTML = "";

            data.forEach(usuario => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${usuario.id}</td>
                    <td>${usuario.nombre}</td>
                    <td>${usuario.correo}</td>
                    <td>${usuario.contraseña}</td>
                    <td>${usuario.role}</td>
                    `;
                
                const celdaAcciones = document.createElement("td");
                const buttonEdit = document.createElement("button");
                const buttonDelete = document.createElement("button");

                buttonEdit.classList.add("buttonDisplay");
                buttonEdit.textContent = "Editar";
                buttonDelete.classList.add("buttonDisplay");
                buttonDelete.textContent = "Eliminar";

                // Eliminar jugador
                buttonDelete.addEventListener('click', () => {
                    if (confirm("¿Deseas eliminar este usuario?")) {
                        fetch(`${API_URL_USUARIOS}/${usuario.id}`, {
                            method: "DELETE"
                        })
                        .then(() => console.log("Eliminacion de usuario correcta"))
                        .catch(error => console.error("Error al eliminar usuario", error));
                    }
                });

                // // Editar jugador
                // buttonEdit.addEventListener('click', () => {
                //     document.getElementById('nombreRegistro').value = usuario.nombre;
                //     document.getElementById('correoRegistro').value = usuario.correo;
                //     document.getElementById('contraseñaRegistro').value = usuario.contraseña;
                //     document.getElementById('roleRegistro').value = usuario.role;
                //     document.getElementById('form-registro').dataset.editingId = usuario.id;
                // });
                //Para usarse se deben tener formularios desde admin

                celdaAcciones.appendChild(buttonDelete);
                celdaAcciones.appendChild(buttonEdit);
                row.appendChild(celdaAcciones);
                tbody.appendChild(row);
            });
        });
}

function tablaAdminReserva(){
    fetch(API_URL_RESERVAS)
        .then(res => res.json())
        .then(data => {
            const tbody = document.getElementById('tabla-admin-reserva');
            tbody.innerHTML = "";

            data.forEach(reserva => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${reserva.id}</td>
                    <td>${reserva.nombre}</td>
                    <td>${reserva.titulo}</td>
                    `;

                const celdaAcciones = document.createElement("td");
                const buttonEdit = document.createElement("button");
                const buttonDelete = document.createElement("button");

                buttonEdit.classList.add("buttonDisplay");
                buttonEdit.textContent = "Editar";
                buttonDelete.classList.add("buttonDisplay");
                buttonDelete.textContent = "Eliminar";

                // Eliminar jugador
                buttonDelete.addEventListener('click', () => {
                    if (confirm("¿Deseas eliminar esta reserva?")) {
                        fetch(`${API_URL_RESERVAS}/${reserva.id}`, {
                            method: "DELETE"
                        })
                        .then(() => console.log("Eliminacion de reserva correcta"))
                        .catch(error => console.error("Error al eliminar reserva", error));
                    }
                });

                celdaAcciones.appendChild(buttonDelete);
                celdaAcciones.appendChild(buttonEdit);
                row.appendChild(celdaAcciones);
                tbody.appendChild(row);
            });
        });
}

function tablaAdminLibros(){
    fetch(API_URL_LIBROS)
        .then(res => res.json())
        .then(data => {
            const tbody = document.getElementById('tabla-admin-libros');
            tbody.innerHTML = "";

            data.forEach(libro => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${libro.id}</td>
                    <td>${libro.titulo}</td>
                    <td>${libro.autor}</td>
                    <td>${libro.unidades}</td>
                    `;

                const celdaAcciones = document.createElement("td");
                const buttonEdit = document.createElement("button");
                const buttonDelete = document.createElement("button");

                buttonEdit.classList.add("buttonDisplay");
                buttonEdit.textContent = "Editar";
                buttonDelete.classList.add("buttonDisplay");
                buttonDelete.textContent = "Eliminar";

                // Eliminar jugador
                buttonDelete.addEventListener('click', () => {
                    if (confirm("¿Deseas eliminar este libro?")) {
                        fetch(`${API_URL_LIBROS}/${libro.id}`, {
                            method: "DELETE"
                        })
                        .then(() => console.log("Eliminacion de reserva correcta"))
                        .catch(error => console.error("Error al eliminar reserva", error));
                    }
                });

                celdaAcciones.appendChild(buttonDelete);
                celdaAcciones.appendChild(buttonEdit);
                row.appendChild(celdaAcciones);
                tbody.appendChild(row);
            });
        });
}


//vista usuario vamos a agregar tabla de libros con el boton reservar
function tablaUserLibros(){
    fetch(API_URL_LIBROS)
        .then(res => res.json())
        .then(data => {
            const tbody = document.getElementById('tabla-user-libros');
            tbody.innerHTML = "";

            data.forEach(libro => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${libro.id}</td>
                    <td>${libro.titulo}</td>
                    <td>${libro.autor}</td>
                    <td>${libro.unidades}</td>
                    `;

                const celdaAcciones = document.createElement("td");
                const buttonReservar = document.createElement("button");

                buttonReservar.classList.add("buttonDisplay");
                buttonReservar.textContent = "Reservar";



                buttonReservar.addEventListener('click', () => {
                    if (libro.unidades <= 0) {
                        alert("Este libro no está disponible.");
                        return;
                    }

                    const nombre = prompt("Ingresa tu nombre para completar la reserva:");
                    if (!nombre) {
                        alert("Nombre requerido para reservar.");
                        return;
                    }

                    const nuevaReserva = {
                        // id: crypto.randomUUID(), // o puedes usar Date.now().toString()
                        nombre: nombre,
                        titulo: libro.titulo
                    };

                    fetch(API_URL_RESERVAS, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(nuevaReserva)
                    })
                    .then(() => {
                        // actualizar unidades del libro
                        return fetch(`${API_URL_LIBROS}/${libro.id}`, {
                            method: "PATCH",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ unidades: libro.unidades - 1 })
                        });
                    })
                    .then(() => {
                        alert("Reserva realizada con éxito.");
                        tablaUserLibros(); // refrescar la tabla
                    })
                    .catch(error => {
                        console.error("Error al reservar:", error);
                        alert("Error al hacer la reserva.");
                    });
                });



                celdaAcciones.appendChild(buttonReservar);
                row.appendChild(celdaAcciones);
                tbody.appendChild(row);
            });
        });
}

function mostrarTodasLasReservas() {
    fetch(API_URL_RESERVAS)
        .then(res => res.json())
        .then(reservas => {
            const tbody = document.getElementById("tabla-user-reservas");
            tbody.innerHTML = "";

            if (reservas.length === 0) {
                alert("El libro ya no esta disponible")
                return;
            }

            reservas.forEach(reserva => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${reserva.id || '-'}</td>
                    <td>${reserva.nombre}</td>
                    <td>${reserva.titulo}</td>
                `;
                tbody.appendChild(row);
            });
        })
        .catch(error => {console.error("Error al cargar reservas:", error);
        });
}




// Cuando el DOM está cargado, renderizamos la vista actual (útil para carga directa en una URL)
window.addEventListener('DOMContentLoaded', renderRoute);

// Cuando cambia el hash en la URL (cuando se navega entre vistas), renderizamos la vista nueva
window.addEventListener('hashchange', renderRoute);

// Escuchamos clicks para poder interceptar y manejar la navegación SPA sin recarga
window.addEventListener('click', onNavClick);

function tablaAdminUsuario(){
    fetch(API_URL_USUARIOS)
        .then(res => res.json())
        .then(data => {
            const tbody = document.getElementById('tabla-admin-usuarios');
            tbody.innerHTML = "";

            data.forEach(usuario => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${usuario.id}</td>
                    <td>${usuario.nombre}</td>
                    <td>${usuario.correo}</td>
                    <td>${usuario.contraseña}</td>
                    <td>${usuario.role}</td>
                `;
                
                const celdaAcciones = document.createElement("td");
                const buttonEdit = document.createElement("button");
                const buttonDelete = document.createElement("button");

                buttonEdit.classList.add("buttonDisplay");
                buttonEdit.textContent = "Editar";
                buttonDelete.classList.add("buttonDisplay");
                buttonDelete.textContent = "Eliminar";

                // Eliminar usuario
                buttonDelete.addEventListener('click', () => {
                    if (confirm("¿Deseas eliminar este usuario?")) {
                        fetch(`${API_URL_USUARIOS}/${usuario.id}`, {
                            method: "DELETE"
                        })
                        .then(() => {
                            console.log("Eliminacion de usuario correcta");
                            tablaAdminUsuario(); // refresca la tabla
                        })
                        .catch(error => console.error("Error al eliminar usuario", error));
                    }
                });

                // Editar usuario
                buttonEdit.addEventListener('click', () => {
                    const nuevoNombre = prompt("Nuevo nombre:", usuario.nombre);
                    const nuevoCorreo = prompt("Nuevo correo:", usuario.correo);
                    const nuevaContraseña = prompt("Nueva contraseña:", usuario.contraseña);
                    const nuevoRol = prompt("Nuevo rol (admin/usuario):", usuario.role);

                    if (nuevoNombre && nuevoCorreo && nuevaContraseña && nuevoRol) {
                        fetch(`${API_URL_USUARIOS}/${usuario.id}`, {
                            method: "PATCH",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                nombre: nuevoNombre,
                                correo: nuevoCorreo,
                                contraseña: nuevaContraseña,
                                role: nuevoRol
                            })
                        })
                        .then(() => {
                            alert("Usuario actualizado");
                            tablaAdminUsuario(); // refresca la tabla
                        })
                        .catch(error => alert("Error al actualizar usuario"));
                    }
                });

                celdaAcciones.appendChild(buttonDelete);
                celdaAcciones.appendChild(buttonEdit);
                row.appendChild(celdaAcciones);
                tbody.appendChild(row);
            });
        });
}


function tablaAdminReserva(){
    fetch(API_URL_RESERVAS)
        .then(res => res.json())
        .then(data => {
            const tbody = document.getElementById('tabla-admin-reserva');
            tbody.innerHTML = "";

            data.forEach(reserva => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${reserva.id}</td>
                    <td>${reserva.nombre}</td>
                    <td>${reserva.titulo}</td>
                `;

                const celdaAcciones = document.createElement("td");
                const buttonEdit = document.createElement("button");
                const buttonDelete = document.createElement("button");

                buttonEdit.classList.add("buttonDisplay");
                buttonEdit.textContent = "Editar";
                buttonDelete.classList.add("buttonDisplay");
                buttonDelete.textContent = "Eliminar";

                // Eliminar reserva
                buttonDelete.addEventListener('click', () => {
                    if (confirm("¿Deseas eliminar esta reserva?")) {
                        fetch(`${API_URL_RESERVAS}/${reserva.id}`, {
                            method: "DELETE"
                        })
                        .then(() => {
                            console.log("Eliminacion de reserva correcta");
                            tablaAdminReserva(); // refresca la tabla
                        })
                        .catch(error => console.error("Error al eliminar reserva", error));
                    }
                });

                // Editar reserva
                buttonEdit.addEventListener('click', () => {
                    const nuevoNombre = prompt("Nuevo nombre:", reserva.nombre);
                    const nuevoTitulo = prompt("Nuevo título:", reserva.titulo);

                    if (nuevoNombre && nuevoTitulo) {
                        fetch(`${API_URL_RESERVAS}/${reserva.id}`, {
                            method: "PATCH",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                nombre: nuevoNombre,
                                titulo: nuevoTitulo
                            })
                        })
                        .then(() => {
                            alert("Reserva actualizada");
                            tablaAdminReserva(); // refresca la tabla
                        })
                        .catch(error => alert("Error al actualizar reserva"));
                    }
                });

                celdaAcciones.appendChild(buttonDelete);
                celdaAcciones.appendChild(buttonEdit);
                row.appendChild(celdaAcciones);
                tbody.appendChild(row);
            });
        });
}

function tablaAdminLibros(){
    fetch(API_URL_LIBROS)
        .then(res => res.json())
        .then(data => {
            const tbody = document.getElementById('tabla-admin-libros');
            tbody.innerHTML = "";

            data.forEach(libro => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${libro.id}</td>
                    <td>${libro.titulo}</td>
                    <td>${libro.autor}</td>
                    <td>${libro.unidades}</td>
                `;

                const celdaAcciones = document.createElement("td");
                const buttonEdit = document.createElement("button");
                const buttonDelete = document.createElement("button");

                buttonEdit.classList.add("buttonDisplay");
                buttonEdit.textContent = "Editar";
                buttonDelete.classList.add("buttonDisplay");
                buttonDelete.textContent = "Eliminar";

                // Eliminar libro
                buttonDelete.addEventListener('click', () => {
                    if (confirm("¿Deseas eliminar este evento?")) {
                        fetch(`${API_URL_LIBROS}/${libro.id}`, {
                            method: "DELETE"
                        })
                        .then(() => {
                            console.log("Eliminacion de evneto correcta");
                            tablaAdminLibros(); // refresca la tabla
                        })
                        .catch(error => console.error("Error al eliminar evento", error));
                    }
                });

                // Editar libro
                buttonEdit.addEventListener('click', () => {
                    const nuevoTitulo = prompt("Nuevo título:", libro.titulo);
                    const nuevoAutor = prompt("Nuevo autor:", libro.autor);
                    const nuevasUnidades = prompt("Nuevas unidades:", libro.unidades);

                    if (nuevoTitulo && nuevoAutor && nuevasUnidades) {
                        fetch(`${API_URL_LIBROS}/${libro.id}`, {
                            method: "PATCH",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                titulo: nuevoTitulo,
                                autor: nuevoAutor,
                                unidades: Number(nuevasUnidades)
                            })
                        })
                        .then(() => {
                            alert("Evento actualizado");
                            tablaAdminLibros(); // refresca la tabla
                        })
                        .catch(error => alert("Error al actualizar evento"));
                    }
                });

                celdaAcciones.appendChild(buttonDelete);
                celdaAcciones.appendChild(buttonEdit);
                row.appendChild(celdaAcciones);
                tbody.appendChild(row);
            });
        });
}


