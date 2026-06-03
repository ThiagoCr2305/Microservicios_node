const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const PORT = process.env.PORT || 3002;
const MONGO_URL = process.env.MONGO_URL || "mongodb://localhost:27017/cursos";

app.use(cors());
app.use(express.json());

// Conexión a MongoDB
mongoose.connect(MONGO_URL)
  .then(() => console.log("Conectado a MongoDB - cursos"))
  .catch((err) => console.error("Error conectando a MongoDB:", err));

// Esquema y modelo
const cursoSchema = new mongoose.Schema({
  nombre:   { type: String, required: true },
  creditos: { type: Number, required: true }
});

const Curso = mongoose.model("Curso", cursoSchema);

// Health check
app.get("/health", (req, res) => {
  res.json({ servicio: "cursos-service", estado: "OK" });
});

// Crear curso
app.post("/cursos", async (req, res) => {
  try {
    const { nombre, creditos } = req.body;
    if (!nombre || !creditos) {
      return res.status(400).json({ mensaje: "El nombre y los créditos son obligatorios" });
    }
    const nuevoCurso = new Curso({ nombre, creditos });
    await nuevoCurso.save();
    res.status(201).json(nuevoCurso);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al crear curso", error: error.message });
  }
});

// Listar todos los cursos
app.get("/cursos", async (req, res) => {
  try {
    const cursos = await Curso.find();
    res.json(cursos);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al consultar cursos", error: error.message });
  }
});

// Obtener curso por ID
app.get("/cursos/:id", async (req, res) => {
  try {
    const curso = await Curso.findById(req.params.id);
    if (!curso) {
      return res.status(404).json({ mensaje: "Curso no encontrado" });
    }
    res.json(curso);
  } catch (error) {
    res.status(404).json({ mensaje: "Curso no encontrado", error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`cursos-service ejecutándose en http://localhost:${PORT}`);
});