const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3004;

app.use(cors());
app.use(express.json());

let profesores = [];
let contadorId = 1;

// Health check
app.get("/health", (req, res) => {
  res.json({ servicio: "profesores-service", estado: "OK" });
});

// Crear profesor
app.post("/profesores", (req, res) => {
  const { nombre, email } = req.body;
  if (!nombre || !email) {
    return res.status(400).json({
      mensaje: "El nombre y el email son obligatorios"
    });
  }
  const nuevoProfesor = { id: contadorId++, nombre, email };
  profesores.push(nuevoProfesor);
  res.status(201).json(nuevoProfesor);
});

// Listar todos los profesores
app.get("/profesores", (req, res) => {
  res.json(profesores);
});

// Obtener profesor por ID
app.get("/profesores/:id", (req, res) => {
  const id = Number(req.params.id);
  const profesor = profesores.find((p) => p.id === id);
  if (!profesor) {
    return res.status(404).json({ mensaje: "Profesor no encontrado" });
  }
  res.json(profesor);
});

app.listen(PORT, () => {
  console.log(`profesores-service ejecutándose en http://localhost:${PORT}`);
});