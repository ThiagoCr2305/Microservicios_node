const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3003;

app.use(cors());
app.use(express.json());

let matriculas = [];
let contadorId = 1;

// Health check
app.get("/health", (req, res) => {
  res.json({ servicio: "matriculas-service", estado: "OK" });
});

// Crear matrícula
app.post("/matriculas", (req, res) => {
  const { usuarioId, cursoId } = req.body;
  if (!usuarioId || !cursoId) {
    return res.status(400).json({
      mensaje: "usuarioId y cursoId son obligatorios"
    });
  }
  const nuevaMatricula = {
    id: contadorId++,
    usuarioId,
    cursoId,
    fecha: new Date().toISOString()
  };
  matriculas.push(nuevaMatricula);
  res.status(201).json(nuevaMatricula);
});

// Listar todas las matrículas
app.get("/matriculas", (req, res) => {
  res.json(matriculas);
});

// Obtener matrículas por usuarioId
app.get("/matriculas/usuario/:usuarioId", (req, res) => {
  const usuarioId = Number(req.params.usuarioId);
  const resultado = matriculas.filter(
    (m) => Number(m.usuarioId) === usuarioId
  );
  res.json(resultado);
});

app.listen(PORT, () => {
  console.log(`matriculas-service ejecutándose en http://localhost:${PORT}`);
});