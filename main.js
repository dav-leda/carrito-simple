
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

  // Seleccionar los botones por su ID en el DOM
  const botonAgregar = select(`#addToCart-${id}`);
  const botonEliminar = select(`#removeFromCart-${id}`);

  // Agregar los event listeners a los botones
  // Pasarle por parametro el producto a los callbacks del evento
  botonAgregar.addEventListener("click", () => addToCart(producto));
  botonEliminar.addEventListener("click", () => borrarProductoDelCarrito(producto));
}


function addToCart(producto) {

  // Obtener el carrito de local storage
  const carrito = getCarrito();
  // Buscar el producto en el carrito por su ID
  const productoEnCarrito = carrito.find(item => item.id === producto.id);

  // Si el producto ya esta en el carrito, aumentar la cantidad
  if (productoEnCarrito) {
    productoEnCarrito.cantidad++;

  // Si el producto no esta en el carrito, agregarlo con cantidad 1
  } else {
    producto.cantidad = 1;
    carrito.push(producto);
  }

  // Mostrar alert con Sweet Alert
  // mostrarAlert('Producto agregado al carrito');

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


// Funcion para borrar un producto del carrito
function borrarProductoDelCarrito(producto) {
  
  const carrito = getCarrito();
  
  const productoABorrar = carrito.find(item => item.id === producto.id);

  // Solo se ejecuta si el carrito tiene el producto que se quiere borrar
  if (productoABorrar) {

    // Borrar el producto del carrito
    const index = carrito.indexOf(productoABorrar);
    carrito.splice(index, 1);

    // Guardar el carrito actualizado en local storage
    saveCarrito(carrito);

    // Mostrar alert producto eliminado del carrito
    mostrarAlert('Producto eliminado del carrito');

    // Mostrar el carrito actualizado
    renderCarrito();
  }
}

// Funcion para mostrar el carrito en el DOM
function renderCarrito() {

  const carrito = getCarrito();
  const contenedorCarrito = select('#carrito');
  const cantidad = select('#cantidad');
  const total = select('#total');

  cantidad.innerText = calcularCantidad(carrito);
  total.innerText = '$' + calcularTotal(carrito);

  // Vaciar el contenido anterior antes de actualizarlo
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
    // Agregar el div del producto al DOM
    contenedorCarrito.append(div);
  }
}

// Funcion para calcular el total de la compra
function calcularTotal (carrito) {
  return carrito.reduce((total, item) => total + item.cantidad * item.precio, 0);
}

// Funcion para calcular la cantidad total de productos en el carrito
function calcularCantidad(carrito) {
  return carrito.reduce((total, item) => total + item.cantidad, 0);
}

// Funcion para mostrar Sweet Alert con distintos mensajes
function mostrarAlert (texto) {
  Swal.fire({
    title: texto,
    icon: 'success',
    timer: 1000
  })
}


// Vaciar local storage al cargar la pagina
localStorage.clear();