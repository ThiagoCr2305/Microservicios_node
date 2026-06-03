const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const PORT = process.env.PORT || 3003;
const MONGO_URL = process.env.MONGO_URL || "mongodb://localhost:27017/matriculas";

app.use(cors());
app.use(express.json());

// Conexión a MongoDB
mongoose.connect(MONGO_URL)
  .then(() => console.log("Conectado a MongoDB - matriculas"))
  .catch((err) => console.error("Error conectando a MongoDB:", err));

// Esquema y modelo
const matriculaSchema = new mongoose.Schema({
  usuarioId: { type: String, required: true },
  cursoId:   { type: String, required: true },
  fecha:     { type: Date, default: Date.now }
});

const Matricula = mongoose.model("Matricula", matriculaSchema);

// Health check
app.get("/health", (req, res) => {
  res.json({ servicio: "matriculas-service", estado: "OK" });
});

// Crear matrícula
app.post("/matriculas", async (req, res) => {
  try {
    const { usuarioId, cursoId } = req.body;
    if (!usuarioId || !cursoId) {
      return res.status(400).json({ mensaje: "usuarioId y cursoId son obligatorios" });
    }
    const nuevaMatricula = new Matricula({ usuarioId, cursoId });
    await nuevaMatricula.save();
    res.status(201).json(nuevaMatricula);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al crear matrícula", error: error.message });
  }
});

// Listar todas las matrículas
app.get("/matriculas", async (req, res) => {
  try {
    const matriculas = await Matricula.find();
    res.json(matriculas);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al consultar matrículas", error: error.message });
  }
});

// Obtener matrículas por usuarioId
app.get("/matriculas/usuario/:usuarioId", async (req, res) => {
  try {
    const matriculas = await Matricula.find({ usuarioId: req.params.usuarioId });
    res.json(matriculas);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al consultar matrículas", error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`matriculas-service ejecutándose en http://localhost:${PORT}`);
});