// {} para descontgruir un objeto
// Importamos la clase Producto
const { Producto } = require("./domain");

function aumentarPrecioBase(productos, monto) {
  productos.forEach((producto) => {
    producto.precioBase = producto.precioBase + monto;
  });
}

function aumentarPrecioBaseMap(productos, monto) {
  return productos.map(
    (p) => new Producto(p.nombre, p.precioBase + monto, p.cantidad),
  );
}

function precioMasAlto(productos) {
  const preciosProductos = productos.map((p) => p.precioFinal());
  // Math.max() recibe argumentos, NO UNA LISTA.
  // Por eso usamos (...unaLista), que deconstruye la lista en argumentos.
  return Math.max(...preciosProductos);
}

// Obtener el producto mas caro
function productoMasCaro(productos){
  const preciosProductos = productos.map((p) => p.precioBase());
  return Math.max(...preciosProductos);
}

function productosMasBaratosQue(productos, precioMaximo) {
  return productos.filter((p) => p.precioFinal() <= precioMaximo);
}

function obtenerSumaTotalPrecios(productos) {
  return productos.reduce((precioAnterior, productoActual) => {
    return precioAnterior + productoActual.precioFinal();
  }, 0);
}

// Usamos SORT con una funcipn lambda para poder redefinir 
// Tenemos que definir un resultaod negativo para cambiar, uno positivo para dejar.
function ordenarListaProductos(productos) {
  productos.sort((p1, p2) => {
    return p1.precioFinal() - p2.precioFinal();
  });
}

module.exports = {
  aumentarPrecioBase,
  aumentarPrecioBaseMap,
  precioMasAlto,
  productosMasBaratosQue,
  obtenerSumaTotalPrecios,
  ordenarListaProductos,
};
