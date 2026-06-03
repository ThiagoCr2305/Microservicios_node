const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const PORT = process.env.PORT || 3004;
const MONGO_URL = process.env.MONGO_URL || "mongodb://localhost:27017/profesores";

app.use(cors());
app.use(express.json());

// Conexión a MongoDB
mongoose.connect(MONGO_URL)
  .then(() => console.log("Conectado a MongoDB - profesores"))
  .catch((err) => console.error("Error conectando a MongoDB:", err));

// Esquema y modelo
const profesorSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  email:  { type: String, required: true }
});

const Profesor = mongoose.model("Profesor", profesorSchema);

// Health check
app.get("/health", (req, res) => {
  res.json({ servicio: "profesores-service", estado: "OK" });
});

// Crear profesor
app.post("/profesores", async (req, res) => {
  try {
    const { nombre, email } = req.body;
    if (!nombre || !email) {
      return res.status(400).json({ mensaje: "El nombre y el email son obligatorios" });
    }
    const nuevoProfesor = new Profesor({ nombre, email });
    await nuevoProfesor.save();
    res.status(201).json(nuevoProfesor);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al crear profesor", error: error.message });
  }
});

// Listar todos los profesores
app.get("/profesores", async (req, res) => {
  try {
    const profesores = await Profesor.find();
    res.json(profesores);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al consultar profesores", error: error.message });
  }
});

// Obtener profesor por ID
app.get("/profesores/:id", async (req, res) => {
  try {
    const profesor = await Profesor.findById(req.params.id);
    if (!profesor) {
      return res.status(404).json({ mensaje: "Profesor no encontrado" });
    }
    res.json(profesor);
  } catch (error) {
    res.status(404).json({ mensaje: "Profesor no encontrado", error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`profesores-service ejecutándose en http://localhost:${PORT}`);
});