const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

let cursos = [];
let contadorId = 1;

// Health check
app.get("/health", (req, res) => {
  res.json({ servicio: "cursos-service", estado: "OK" });
});

// Crear curso
app.post("/cursos", (req, res) => {
  const { nombre, creditos } = req.body;
  if (!nombre || !creditos) {
    return res.status(400).json({
      mensaje: "El nombre y los créditos son obligatorios"
    });
  }
  const nuevoCurso = { id: contadorId++, nombre, creditos };
  cursos.push(nuevoCurso);
  res.status(201).json(nuevoCurso);
});

// Listar todos los cursos
app.get("/cursos", (req, res) => {
  res.json(cursos);
});

// Obtener curso por ID
app.get("/cursos/:id", (req, res) => {
  const id = Number(req.params.id);
  const curso = cursos.find((c) => c.id === id);
  if (!curso) {
    return res.status(404).json({ mensaje: "Curso no encontrado" });
  }
  res.json(curso);
});

app.listen(PORT, () => {
  console.log(`cursos-service ejecutándose en http://localhost:${PORT}`);
});