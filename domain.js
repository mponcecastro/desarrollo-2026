export class Producto {
  constructor(nombre, precioBase, cantidad) {
    if (!nombre) {
      throw new Error("El producto debe tener un nombre");
    }
    this.nombre = nombre;
    this.precioBase = precioBase;
    this.cantidad = cantidad;
    this.descuentos = [];
}

  agregarDescuento(descuento) {
    this.descuentos.push(descuento);
  }
}

export class DescuentoFijo {
  constructor(valor) {
    if (valor <= 0) {
      throw new Error("Un descuento no puede ser negativo.");
    }
    this.valor = valor;
  }
  valorDescontado(precioBase, cantidad) {
    return this.valor;
  }
}

export class DescuentoPorcentual {
  constructor(porcentaje) {
    this.porcentaje = porcentaje;
  }

  valorDescontado(precioBase, cantidad) {
    return (cantidad * precioBase * this.porcentaje) / 100;
  }
}

export class DescuentoPorCantidad {
  constructor(cantidadMinima, porcentaje) {
    this.cantidadMinima = cantidadMinima;
    this.porcentaje = porcentaje;
  }

  valorDescontado(precioBase, cantidad) {
    const vecesRepetida = Math.floor(cantidad / this.cantidadMinima);
    let valorDescontado = 0;
    if (vecesRepetida >= 1) {
      valorDescontado = precioBase * (this.porcentaje / 100) * vecesRepetida;
    }
    return valorDescontado;
  }
}

export class Carrito {
  constructor([items]){
    this.items = [items];
  }
  
  agregarItem(item){
    this.items.push(item);
  }   
}

export class ItemCarrito{
  constructor(producto, cantidad){
    this.producto = producto
    this.cantidad = cantidad
    this.descuentos = []
  }

  agregarDescuento(nuevoDescuento) {
    this.descuentos.push(nuevoDescuento);
  }

  precioFinal() {
    const precioBaseTotal = this.cantidad * this.producto.precioBase;

    // ========= FUNCION FOLD (reduce() en .js) + LAMDA ========= 
    const precioFinal = this.descuentos.reduce((precioAnterior, descuento) => {
      return (
        precioAnterior -
        descuento.valorDescontado(this.producto.precioBase, this.cantidad)
      );
    }, precioBaseTotal);
    // precioAnterior: acumulador 
    // descuento: elemento de la lista que procesamos
    // descuento.valorDescontado(...): funcion que calcula la resta
    // precioBaseTotal: valor incial sobre el que empieza a operar

    return Math.max(0, precioFinal);
  }
}
