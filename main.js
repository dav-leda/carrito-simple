
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

select = element => document.querySelector(element);
create = element => document.createElement(element);

const contenedorProductos = select('#productos');

for (let producto of productos) {

  const div = create('div');

  const { id, nombre, precio } = producto;

  div.innerHTML = `
    <div class="box">
      <h2>${nombre}</h2>
      <h3>Precio: $${precio}</h3>
      <button id="addToCart-${id}">Agregar al carrito</button>
      <button id="removeFromCart-${id}" class="mt-1">Eliminar del carrito</button>
    </div>  
  `;

  contenedorProductos.append(div)

  const botonAgregar = select(`#addToCart-${id}`);
  const botonEliminar = select(`#removeFromCart-${id}`);

  botonAgregar.addEventListener("click", () => addToCart(producto));
  botonEliminar.addEventListener("click", () => borrarProductoDelCarrito(producto));
}


function addToCart(producto) {

  const carrito = getCarrito();
  const productoEnCarrito = carrito.find(item => item.id === producto.id) || false;

  if (productoEnCarrito) {
    productoEnCarrito.cantidad++;
  } else {
    producto.cantidad = 1;
    carrito.push(producto);
  }
  saveCarrito(carrito)
  renderCarrito();
}

function getCarrito () {
  return JSON.parse(localStorage.getItem("carrito")) || [];
}

function saveCarrito (carrito) {
  localStorage.setItem('carrito', JSON.stringify(carrito));
  console.log(carrito)
}

function borrarProductoDelCarrito(producto) {
  const carrito = getCarrito();
  const nuevoCarrito = carrito.filter(item => item.id != producto.id);
  saveCarrito(nuevoCarrito);
  renderCarrito();
}


function renderCarrito() {

  const carrito = getCarrito();
  const contenedorCarrito = select('#carrito');
  const total = select('#total');

  total.innerHTML = `<h3>Total: $${calcularTotal()}</h3>`;
  contenedorCarrito.innerHTML = '';

  for (let producto of carrito) {

    const { nombre, precio, cantidad } = producto;

    const div = create('div');

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

function calcularTotal () {
  const carrito = getCarrito();
  const total = carrito.reduce((total, item) => total + item.cantidad * item.precio, 0);
  return total;
}

localStorage.clear();