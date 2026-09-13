import { Producto } from "./domain.js";

export function aumentarPrecioBase(carrito, monto) {
  carrito.forEach((item) => {
    item.producto.precioBase = item.producto.precioBase + monto;
  });
}

export function aumentarPrecioBaseMap(carrito, monto) {
  return carrito.map(
    (item) => new Producto(item.producto.nombre, item.producto.precioBase + monto, item.cantidad),
  );
}

export function precioMasAlto(carrito) {
  const preciosProductos = carrito.map((item) => item.precioFinal());
  // Math.max() recibe argumentos, NO UNA LISTA.
  // Por eso usamos (...unaLista), que deconstruye la lista en argumentos.
  return Math.max(...preciosProductos);
}

// Obtener el producto mas caro
export function productoMasCaro(carrito){
  const preciosProductos = carrito.map((item) => item.precioFinal());
  return Math.max(...preciosProductos);
}

export function productosMasBaratosQue(carrito, precioMaximo) {
  return carrito.filter((item) => item.precioFinal() <= precioMaximo);
}

export function obtenerSumaTotalPrecios(carrito) {
    return carrito.reduce((total, item) => total + item.precioFinal(), 0);
}

// Usamos SORT con una funcipn lambda para poder redefinir 
// Tenemos que definir un resultaod negativo para cambiar, uno positivo para dejar.
export function ordenarCarrito(carrito) {
    carrito.sort((a, b) => a.precioFinal() - b.precioFinal());
}

