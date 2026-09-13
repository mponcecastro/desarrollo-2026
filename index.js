import express from "express";
import { z } from 'zod';
import {
  Producto,
  ItemCarrito,
  DescuentoPorCantidad,
} from "./domain.js";
import {
  obtenerSumaTotalPrecios,
  ordenarCarrito,
  productosMasBaratosQue,
} from "./funciones.js";

const app = express();

// Cosas que va a mirar zod cuando llega un body a nuestros endpoints
// Son las verificaciones del controller, del formato, no las de negocio
const itemsSchema = z.object({
  nombre: z.string()
    .trim()
    .min(2)
    .max(100)
    .transform((value) => value.toLowerCase()), // Normalizamos el nombre a minusculas
  precio: z.number().nonnegative(),
  desc: z.string().min(2).max(10)
});
// puedo usar .strict en el schema para que no me deje pasar campos que no definí

app.use(express.json());

// ==================== EJEMPLO p/endpoints ====================
const carritoChico = [];
const item1 = new ItemCarrito(new Producto("Coca-cola", 1000), 3);
item1.agregarDescuento(new DescuentoPorCantidad(3, 100));
const item2 = new ItemCarrito(new Producto("Papas lays", 2000), 1);
carritoChico.push(item1, item2);

console.log("Carrito:", carritoChico);
console.log("Precio item1:", item1.precioFinal());
console.log("Precio item2:", item2.precioFinal());

const carritoBebidas = [
  new ItemCarrito(new Producto("Cocacola", 1000), 1),
  new ItemCarrito(new Producto("7up", 2000), 1),
  new ItemCarrito(new Producto("Jugo", 1500), 1),
  new ItemCarrito(new Producto("Agua", 700), 1),
];

console.log("Productos baratos:", productosMasBaratosQue(carritoBebidas, 1500));
console.log("Total:", obtenerSumaTotalPrecios(carritoBebidas));

ordenarCarrito(carritoBebidas);
console.log("Ordenado:", carritoBebidas);


// ==================== RUTAS ====================

app.listen(3000, () => {
  console.log("Servidor corriendo!");
});

// <<<<<<<<<<< ENDPOINT PARA HEALTHCHECK >>>>>>>>>>>>>>
app.get("/healthcheck", (req, res) => {
  res.status(200).json({
    status: "ok",
    timeStamp: new Date().toISOString(),
    message: "AL FINNNNN"
  });
});

// <<<<<<<<<<< ENDPOINT CON PATH PARAMS >>>>>>>>>>>>>>
app.get("/items/:id", (req, res) => {
  const id = req.params.id;
  const item = carritoBebidas[id];

  if (!item) {
    res.status(404).json({
      error: "Item not found"
    });
    return;
  }

  res.status(200).json({
    item: item
  });
});

// <<<<<<<<<<< ENDPOINT CON QUERY PARAMS >>>>>>>>>>>>>>
app.get("/items", (req, res) => {
  const precioMenor = req.query.precio_lt
  const productosFiltrados = productosMasBaratosQue(carritoBebidas, precioMenor)

  // Si no me mandaron el query param, devuelvo todo el carrito
  if(!precioMenor){
    res.status(200).json({
      items : carritoBebidas
    });
    return;   // SUUUPER importante pq sino rompe pq quiere volver a mandar la rta
  }

  // Si me lo mandan, devuelvo solo los productos que cumplan la condicion
  res.status(200).json({
    items: productosFiltrados,
  });
});


// <<<<<<<<<<< ENDPOINT POST AL CARRITO >>>>>>>>>>>>>>
app.post("/items", (req, res) => {
  const body = req.body

  const resultado = itemsSchema.safeParse(body);
  if (resultado.error) {
    res.status(400).json({
      error: resultado.error
    });
    return;
  }

  const nuevo = resultado.data;
  const itemExistente = carritoBebidas.some(
    (i) => i.producto.nombre.trim().toLowerCase() === nuevo.nombre);

  if(itemExistente){
    res.status(409).json({
      error: "El producto ya existe"
    });
    return;
  }

  carritoBebidas.push(new ItemCarrito(new Producto(nuevo.nombre, nuevo.precio), 1));
  res.status(201).json({
    message: "Producto agregado",
    item: nuevo
  });
});

// <<<<<<<<<<< ENDPOINT DELETE AL CARRITO >>>>>>>>>>>>>>
app.delete("/items/:id", (req, res) => {
  const id = req.params.id;
  const item = carritoBebidas[id];
  if (!item) {
    res.status(404).json({
      error: "Item not found"
    });
    return;
  }
  carritoBebidas.splice(id, 1);
  res.status(204).json({
    message: "Item eliminado"
  });
});

// <<<<<<<<<<< ENDPOINT PUT AL CARRITO >>>>>>>>>>>>>>
app.put("/items/:id", (req, res) => {
  const body = req.body;
  const resultado = itemsSchema.safeParse(body);
  if(resultado.error){
    res.status(400).json({
      error: resultado.error
    });
    return;
  }
  const update = resultado.data;
  const id = req.params.id;
  const itemExistente = carritoBebidas[id];
  if(!itemExistente){
    res.status(404).json({
      error: "Item not found"
    });
    return;
  }

  const itemConNombreExistente = carritoBebidas.some(
    (i, index) => i.producto.nombre.trim().toLowerCase() === update.nombre  );

  if(itemConNombreExistente){
    res.status(409).json({
      error: "El producto ya existe"
    });
    return;
  }

  itemExistente.producto.nombre = update.nombre;
  itemExistente.producto.precioBase = update.precio;
  res.status(200).json({
    message: "Item actualizado",
    item: itemExistente
  });
});