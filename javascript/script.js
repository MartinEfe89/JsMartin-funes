/* Array de items del menu */
let menu = [];

async function conseguirDatos() {
    try {
        const url = "./javascript/menu.json";
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Error al cargar el menú');
        }
        menu = await response.json();
        renderizarMenu();
    } catch (error) {
        console.error('Error:', error);
        Swal.fire({
            title: 'Error',
            text: 'No se pudo cargar el menú. Por favor, intente más tarde.',
            icon: 'error',
            background: '#F4EBDC',
            confirmButtonColor: '#14B486',
        });
    }
}

/* Llamada a la función para conseguir datos del menú */
conseguirDatos();

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
        // desplazamiento al final del carrito
        const carritoContainer = document.getElementById('carrito');
        window.scrollTo({
            top: carritoContainer.offsetTop + carritoContainer.scrollHeight,
            behavior: 'smooth'
        });
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

/* Función para calcular el total de la compra */
function calcularTotal() {
    return carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0);
}

/* Renderizar header con título e imagen */
function renderizarHeader() {
    const headerContainer = document.createElement('div');
    headerContainer.className = 'headerTitulo';

    const img = document.createElement('img');
    img.src = './imagenes/logogato.png';
    img.alt = 'Logo de la tienda';

    const h1 = document.createElement('h1');
    h1.textContent = 'Tienda de Comidas Don Pelusa';

    headerContainer.appendChild(img);
    headerContainer.appendChild(h1);
    document.body.prepend(headerContainer);
}

/* Renderizar el menú en Card */
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

/* Función para vaciar el carrito y SweetAlert con validación */
function vaciarCarrito() {
    const inputNombreApellido = document.querySelector('.input-nombre-apellido');
    const inputEmail = document.querySelector('.input-email');

    // Verificar si los campos están vacíos y usar Toastify
    if (!inputNombreApellido.value.trim() || !inputEmail.value.trim()) {
        Toastify({
            text: "Por favor, complete los campos solicitados.",
            duration: 3000,
            style:{
                background: "#E0782F",
            },
        }).showToast();
        return;
    }

    // Calcular el total de la compra
    const totalCompra = calcularTotal();

    Swal.fire({
        title: "¿Está seguro?",
        text: `Está por finalizar su compra. El total a pagar es: $${totalCompra.toFixed(2)}`,
        icon: "warning",
        background: "#F4EBDC",
        showCancelButton: true,
        confirmButtonColor: "#14B486",
        cancelButtonColor: "#ED232B",
        confirmButtonText: "¡Sí, finalizar compra!",
    }).then((result) => {
        if (result.isConfirmed) {
            carrito.length = 0;
            guardarCarrito();
            renderizarCarrito();
            Swal.fire({
                title: "¡Compra finalizada!",
                text: `Gracias por utilizar nuestros servicios.`,
                icon: "success",
                background: "#F4EBDC",
                confirmButtonColor: "#14B486",
            });
        }
    });
}
/* Renderizar el carrito en Card */
function renderizarCarrito() {
    const carritoContainer = document.getElementById('carrito');
    carritoContainer.innerHTML = '';

    /* Contenedor para tarjetas del carrito */
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
            <button class="button-trash" onclick="eliminarDelCarrito(${item.id})">
                <img src="./imagenes/delete-icon.svg" alt="Eliminar del carrito">
            </button>`;
        itemsContainer.appendChild(card);
    });

    carritoContainer.appendChild(itemsContainer);

    /* Mostrar el total de la compra */
    const totalCompra = calcularTotal();
    const totalElement = document.createElement('div');
    totalElement.className = 'total-compra';
    totalElement.innerHTML = `<h3>Total de la compra: $${totalCompra.toFixed(2)}</h3>`;

    /* Campos de entrada para nombre, apellido y email */
    const formContainer = document.createElement('div');
    formContainer.className = 'form-container';

    const inputNombreApellido = document.createElement('input');
    inputNombreApellido.type = 'text';
    inputNombreApellido.placeholder = 'Nombre y Apellido';
    inputNombreApellido.className = 'input-nombre-apellido';

    const inputEmail = document.createElement('input');
    inputEmail.type = 'email';
    inputEmail.placeholder = 'Correo Electrónico';
    inputEmail.className = 'input-email';

    formContainer.appendChild(inputNombreApellido);
    formContainer.appendChild(inputEmail);

    carritoContainer.appendChild(totalElement);
    carritoContainer.appendChild(formContainer);

    /* Botón de finalizar compra */
    if (carrito.length > 0) {
        const finalizarButton = document.createElement('button');
        finalizarButton.className = 'button-finalizar';
        finalizarButton.textContent = 'Finalizar Compra';
        finalizarButton.onclick = vaciarCarrito;

        carritoContainer.appendChild(finalizarButton);
    }
}

// Inicializar la página
renderizarHeader();
renderizarCarrito();
