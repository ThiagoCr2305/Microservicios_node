const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

let usuarios = [];
let contadorId = 1;

app.get("/health", (req, res) => {
  res.json({
    servicio: "usuarios-service",
    estado: "OK"
  });
});

app.post("/usuarios", (req, res) => {
  const { nombre, email } = req.body;

  if (!nombre || !email) {
    return res.status(400).json({
      mensaje: "El nombre y el email son obligatorios"
    });
  }

  const nuevoUsuario = {
    id: contadorId++,
    nombre,
    email
  };

  usuarios.push(nuevoUsuario);

  res.status(201).json(nuevoUsuario);
});

app.get("/usuarios", (req, res) => {
  res.json(usuarios);
});

app.get("/usuarios/:id", (req, res) => {
  const id = Number(req.params.id);
  const usuario = usuarios.find((u) => u.id === id);

  if (!usuario) {
    return res.status(404).json({
      mensaje: "Usuario no encontrado"
    });
  }

  res.json(usuario);
});

app.listen(PORT, () => {
  console.log(`usuarios-service ejecutándose en http://localhost:${PORT}`);
});
