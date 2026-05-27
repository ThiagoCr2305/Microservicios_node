const express = require("express");
const cors = require("cors");
const axios = require("axios");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const USUARIOS_SERVICE   = process.env.USUARIOS_SERVICE   || "http://localhost:3001";
const CURSOS_SERVICE     = process.env.CURSOS_SERVICE     || "http://localhost:3002";
const MATRICULAS_SERVICE = process.env.MATRICULAS_SERVICE || "http://localhost:3003";
const PROFESORES_SERVICE = process.env.PROFESORES_SERVICE || "http://localhost:3004";

// Info general
app.get("/", (req, res) => {
  res.json({
    mensaje: "API Gateway del Sistema Académico",
    rutas: [
      "GET  /api/usuarios",
      "POST /api/usuarios",
      "GET  /api/cursos",
      "POST /api/cursos",
      "GET  /api/matriculas",
      "POST /api/matriculas",
      "GET  /api/resumen/matriculas"
    ]
  });
});

// ── Usuarios ──────────────────────────────────────────────
app.get("/api/usuarios", async (req, res) => {
  try {
    const respuesta = await axios.get(`${USUARIOS_SERVICE}/usuarios`);
    res.json(respuesta.data);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al consultar usuarios", error: error.message });
  }
});

app.post("/api/usuarios", async (req, res) => {
  try {
    const respuesta = await axios.post(`${USUARIOS_SERVICE}/usuarios`, req.body);
    res.status(201).json(respuesta.data);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al crear usuario", error: error.message });
  }
});

// ── Cursos ────────────────────────────────────────────────
app.get("/api/cursos", async (req, res) => {
  try {
    const respuesta = await axios.get(`${CURSOS_SERVICE}/cursos`);
    res.json(respuesta.data);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al consultar cursos", error: error.message });
  }
});

app.post("/api/cursos", async (req, res) => {
  try {
    const respuesta = await axios.post(`${CURSOS_SERVICE}/cursos`, req.body);
    res.status(201).json(respuesta.data);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al crear curso", error: error.message });
  }
});

// ── Matrículas ────────────────────────────────────────────
app.get("/api/matriculas", async (req, res) => {
  try {
    const respuesta = await axios.get(`${MATRICULAS_SERVICE}/matriculas`);
    res.json(respuesta.data);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al consultar matrículas", error: error.message });
  }
});

app.post("/api/matriculas", async (req, res) => {
  try {
    const { usuarioId, cursoId } = req.body;
    if (!usuarioId || !cursoId) {
      return res.status(400).json({ mensaje: "usuarioId y cursoId son obligatorios" });
    }
    // Valida que existan antes de matricular
    await axios.get(`${USUARIOS_SERVICE}/usuarios/${usuarioId}`);
    await axios.get(`${CURSOS_SERVICE}/cursos/${cursoId}`);

    const respuesta = await axios.post(`${MATRICULAS_SERVICE}/matriculas`, { usuarioId, cursoId });
    res.status(201).json({ mensaje: "Matrícula creada correctamente", matricula: respuesta.data });
  } catch (error) {
    res.status(400).json({
      mensaje: "No se pudo crear la matrícula. Verifique usuarioId y cursoId.",
      error: error.message
    });
  }
});

// ── Resumen ───────────────────────────────────────────────
app.get("/api/resumen/matriculas", async (req, res) => {
  try {
    const [usuariosRes, cursosRes, matriculasRes] = await Promise.all([
      axios.get(`${USUARIOS_SERVICE}/usuarios`),
      axios.get(`${CURSOS_SERVICE}/cursos`),
      axios.get(`${MATRICULAS_SERVICE}/matriculas`)
    ]);

    const usuarios  = usuariosRes.data;
    const cursos    = cursosRes.data;
    const matriculas = matriculasRes.data;

    const resumen = matriculas.map((matricula) => {
      const usuario = usuarios.find((u) => Number(u.id) === Number(matricula.usuarioId));
      const curso   = cursos.find((c)   => Number(c.id) === Number(matricula.cursoId));
      return {
        idMatricula: matricula.id,
        estudiante:  usuario ? usuario.nombre : "Usuario no encontrado",
        curso:       curso   ? curso.nombre   : "Curso no encontrado",
        fecha:       matricula.fecha
      };
    });

    res.json(resumen);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al generar resumen de matrículas", error: error.message });
  }
});

// ── Profesores ────────────────────────────────────────────
app.get("/api/profesores", async (req, res) => {
  try {
    const respuesta = await axios.get(`${PROFESORES_SERVICE}/profesores`);
    res.json(respuesta.data);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al consultar profesores", error: error.message });
  }
});

app.post("/api/profesores", async (req, res) => {
  try {
    const respuesta = await axios.post(`${PROFESORES_SERVICE}/profesores`, req.body);
    res.status(201).json(respuesta.data);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al crear profesor", error: error.message });
  }
});

app.get("/api/profesores/:id", async (req, res) => {
  try {
    const respuesta = await axios.get(`${PROFESORES_SERVICE}/profesores/${req.params.id}`);
    res.json(respuesta.data);
  } catch (error) {
    res.status(404).json({ mensaje: "Profesor no encontrado", error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`API Gateway ejecutándose en http://localhost:${PORT}`);
});