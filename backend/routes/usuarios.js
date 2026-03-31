const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM usuario ORDER BY id');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

router.post('/', async (req, res) => {
  const { nome, email } = req.body;

  if (!nome || !email) {
    return res.status(400).json({ erro: 'Campos obrigatórios' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO usuario (nome, email) VALUES ($1, $2) RETURNING *',
      [nome, email]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

module.exports = router;