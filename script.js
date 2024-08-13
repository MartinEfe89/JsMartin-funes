/* Array de items del menu */

const menu = [
    { id: 1, nombre: 'Hamburguesa Clásica Completa', precio: 8000, imagen: './imagenes/hamburguesa.jpg' },
    { id: 2, nombre: 'Papas Fritas con cheddar y bacon', precio: 7000, imagen: './imagenes/papasfritas.jpg' },
    { id: 3, nombre: 'Empanadas de Carne', precio: 1700, imagen: './imagenes/empas.jpg' },
    { id: 4, nombre: 'Pizza Margherita', precio: 7000, imagen: './imagenes/pizza.jpg' },
    { id: 5, nombre: 'Tacos de Cerdo Marinado', precio: 8000, imagen: './imagenes/tacos.jpg' },
    { id: 6, nombre: 'Ensalada César', precio: 6000, imagen: './imagenes/ensalada.jpg' }
];

/* Array carrito */

const carrito = cargarCarrito() || [];

/* Función para guardar carrito */
function guardarCarrito() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

/* Función para cargar el carrito */
function cargarCarrito() {
    return JSON.parse(localStorage.getItem('carrito'));
}

/* Función agregar al carrito */
function agregarAlCarrito(id) {
    const item = menu.find(item => item.id === id);
    if (item) {
        const itemEnCarrito = carrito.find(producto => producto.id === id);
        if (itemEnCarrito) {
            itemEnCarrito.cantidad++;
        } else {
            carrito.push({ ...item, cantidad: 1 });
        }
        guardarCarrito();
        renderizarCarrito();
    }
}

/* Función para eliminar item del carrito */
function eliminarDelCarrito(id) {
    const index = carrito.findIndex(item => item.id === id);
    if (index !== -1) {
        if (carrito[index].cantidad > 1) {
            carrito[index].cantidad--;
        } else {
            carrito.splice(index, 1);
        }
        guardarCarrito();
        renderizarCarrito();
    }
}

/* Funcion para calcular el total de la compra*/
function calcularTotal() {
    return carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0);
}


/* Renderizar el menu en Card */
function renderizarMenu() {
    const menuContainer = document.getElementById('menu');
    menuContainer.innerHTML = '';
    menu.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <img src="${item.imagen}" alt="${item.nombre}">
            <h3>${item.nombre}</h3>
            <p>Precio: $${item.precio.toFixed(2)}</p>
            <button class="button" onclick="agregarAlCarrito(${item.id})">Agregar al Carrito</button>`;
        menuContainer.appendChild(card);
    });
}

/* Renderizar el carrito en Card */

function renderizarCarrito() {
    const carritoContainer = document.getElementById('carrito');
    carritoContainer.innerHTML = '';

    /*contenedor para tarjetas del carrito*/
    const itemsContainer = document.createElement('div');
    itemsContainer.className = 'items-container';

    carrito.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <h3>${item.nombre}</h3>
            <p>Precio: $${item.precio.toFixed(2)}</p>
            <p>Cantidad: ${item.cantidad}</p>
            <p>Total: $${(item.precio * item.cantidad).toFixed(2)}</p>
            <button class="button-trash" onclick="eliminarDelCarrito(${item.id})"><img src="./imagenes/delete-icon.svg" alt="eliminarDelCarrito"></button>
        `;
        itemsContainer.appendChild(card);
    });

    carritoContainer.appendChild(itemsContainer);

    /* Mostrar el total de la compra*/

    const totalCompra = calcularTotal();
    const totalElement = document.createElement('div');
    totalElement.className = 'total-compra';
    totalElement.innerHTML = `<h3>Total de la compra: $${totalCompra.toFixed(2)}</h3>`;

    carritoContainer.appendChild(totalElement);
}

// Inicializar la página

renderizarMenu();
renderizarCarrito();
