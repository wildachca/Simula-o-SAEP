const express = require('express');
const router = express.Router();
const pool = require('../db');

const prioridadesValidas = ['baixa', 'media', 'alta'];
const statusValidos = ['a fazer', 'fazendo', 'pronto'];

router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT tarefa.*, usuario.nome 
      FROM tarefa
      JOIN usuario ON tarefa.id_usuario = usuario.id
      ORDER BY tarefa.id
    `);

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

router.post('/', async (req, res) => {
  const { id_usuario, descricao, setor, prioridade } = req.body;

  if (!id_usuario || !descricao || !setor || !prioridade) {
    return res.status(400).json({ erro: 'Campos obrigatórios' });
  }

  if (!prioridadesValidas.includes(prioridade)) {
    return res.status(400).json({ erro: 'Prioridade inválida' });
  }

  try {
    const usuarioExiste = await pool.query(
      'SELECT * FROM usuario WHERE id = $1',
      [id_usuario]
    );

    if (usuarioExiste.rows.length === 0) {
      return res.status(400).json({ erro: 'Usuário não existe' });
    }

    const result = await pool.query(
      `INSERT INTO tarefa (id_usuario, descricao, setor, prioridade)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [id_usuario, descricao, setor, prioridade]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { status, prioridade, descricao, setor } = req.body;

  if (status && !statusValidos.includes(status)) {
    return res.status(400).json({ erro: 'Status inválido' });
  }

  if (prioridade && !prioridadesValidas.includes(prioridade)) {
    return res.status(400).json({ erro: 'Prioridade inválida' });
  }

  try {
    const result = await pool.query(
      `UPDATE tarefa
       SET status = COALESCE($1, status),
           prioridade = COALESCE($2, prioridade),
           descricao = COALESCE($3, descricao),
           setor = COALESCE($4, setor)
       WHERE id = $5
       RETURNING *`,
      [status, prioridade, descricao, setor, id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query('DELETE FROM tarefa WHERE id = $1', [id]);
    res.json({ mensagem: 'Tarefa deletada com sucesso' });
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

module.exports = router;