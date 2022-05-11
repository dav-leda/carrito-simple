
const productos = [
  {
    id: 1,
    nombre: "iPhone",
    precio: 500,
  },
  {
    id: 2,
    nombre: "iPad",  
    precio: 700
  },
  {
    id: 3,
    nombre: "MacBook",
    precio: 1000
  }
]

// Funcion para seleccionar elementos del DOM
const select = element => document.querySelector(element);
// Funcion para crear elementos en el DOM
const create = element => document.createElement(element);

// Seleccionar un elemento por su ID en el DOM
const contenedorProductos = select('#productos');

// Iterar sobre el array de productos
for (let producto of productos) {

  // Crear un elemento div en el DOM
  const div = create('div');

  // Extraer las propiedades del objeto producto
  const { id, nombre, precio } = producto;

  // Plantilla literal para crear el contenido que muestra el producto
  // y los botones para agregar y borrar, referenciados por el ID del producto
  div.innerHTML = `
    <div class="box">
      <h2>${nombre}</h2>
      <h3>Precio: $${precio}</h3>
      <button id="addToCart-${id}">Agregar al carrito</button>
      <button id="removeFromCart-${id}" class="mt-1">Eliminar del carrito</button>
    </div>  
  `;
  // Agregar el div al DOM
  contenedorProductos.append(div)

  // Seleccionar los botones
  const botonAgregar = select(`#addToCart-${id}`);
  const botonEliminar = select(`#removeFromCart-${id}`);

  // Agregar los event listeners a los botones
  // Pasarle por parametro el producto a las funciones
  botonAgregar.addEventListener("click", () => addToCart(producto));
  botonEliminar.addEventListener("click", () => borrarProductoDelCarrito(producto));
}


function addToCart(producto) {

  // Obtener el carrito de local storage
  const carrito = getCarrito();
  // Encontrar el producto por su ID, si no encuentra nada retorna false
  const productoEnCarrito = carrito.find(item => item.id === producto.id) || false;

  // Si el producto ya esta en el carrito, aumentar la cantidad
  if (productoEnCarrito) {
    productoEnCarrito.cantidad++;

  // Si el producto no esta en el carrito, agregarlo con cantidad 1
  } else {
    producto.cantidad = 1;
    carrito.push(producto);
  }
  // Guardar el carrito en local storage
  saveCarrito(carrito)
  // Mostrar el carrito en el DOM
  renderCarrito();
}

// Funcion para obtener el carrito de local storage
// Si no encuentra nada retorna un array vacio: []
function getCarrito () {
  return JSON.parse(localStorage.getItem("carrito")) || [];
}

// Funcion para guardar el carrito en local storage
function saveCarrito (carrito) {
  localStorage.setItem('carrito', JSON.stringify(carrito));
}

function borrarProductoDelCarrito(producto) {
  const carrito = getCarrito();
  const nuevoCarrito = carrito.filter(item => item.id != producto.id);
  saveCarrito(nuevoCarrito);
  renderCarrito();
}

// Funcion para mostrar el carrito en el DOM
function renderCarrito() {

  const carrito = getCarrito();
  const contenedorCarrito = select('#carrito');
  const total = select('#total');

  total.innerHTML = `<h3>Total: $${calcularTotal()}</h3>`;
  contenedorCarrito.innerHTML = '';

  // Iterar sobre el array de productos en el carrito
  for (let producto of carrito) {

    // Extraer las propiedades del objeto producto
    const { nombre, precio, cantidad } = producto;

    const div = create('div');

    // Plantilla literal para mostrar el producto en el carrito
    div.innerHTML = `
      <div class="box">
      <p>Producto: ${nombre}</p>
      <p>Precio: $${precio}</p>
      <p>Cantidad: ${cantidad}</p>
      <p>Subtotal: $${precio * cantidad}</p>
      </div>
    `;

    contenedorCarrito.append(div);
  }
}

// Funcion para calcular el total de la compra
function calcularTotal () {
  const carrito = getCarrito();
  const total = carrito.reduce((total, item) => total + item.cantidad * item.precio, 0);
  return total;
}

// Vaciar local storage al cargar la pagina
localStorage.clear();