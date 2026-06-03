const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const PORT = process.env.PORT || 3001;
const MONGO_URL = process.env.MONGO_URL || "mongodb://localhost:27017/usuarios";

app.use(cors());
app.use(express.json());

// Conexión a MongoDB
mongoose.connect(MONGO_URL)
  .then(() => console.log("Conectado a MongoDB - usuarios"))
  .catch((err) => console.error("Error conectando a MongoDB:", err));

// Esquema y modelo
const usuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  email:  { type: String, required: true }
});

const Usuario = mongoose.model("Usuario", usuarioSchema);

// Health check
app.get("/health", (req, res) => {
  res.json({ servicio: "usuarios-service", estado: "OK" });
});

// Crear usuario
app.post("/usuarios", async (req, res) => {
  try {
    const { nombre, email } = req.body;
    if (!nombre || !email) {
      return res.status(400).json({ mensaje: "El nombre y el email son obligatorios" });
    }
    const nuevoUsuario = new Usuario({ nombre, email });
    await nuevoUsuario.save();
    res.status(201).json(nuevoUsuario);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al crear usuario", error: error.message });
  }
});

// Listar todos los usuarios
app.get("/usuarios", async (req, res) => {
  try {
    const usuarios = await Usuario.find();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al consultar usuarios", error: error.message });
  }
});

// Obtener usuario por ID
app.get("/usuarios/:id", async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id);
    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }
    res.json(usuario);
  } catch (error) {
    res.status(404).json({ mensaje: "Usuario no encontrado", error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`usuarios-service ejecutándose en http://localhost:${PORT}`);
});