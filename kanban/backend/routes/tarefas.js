const router = require('express').Router();
const db = require('../db');

// Criar tarefa
router.post('/', async (req, res) => {
    const { id_usuario, descricao, setor, prioridade } = req.body;

    if (!id_usuario || !descricao || !setor || !prioridade) {
        return res.status(400).json({ erro: "Preencha tudo" });
    }

    const result = await db.query(
        `INSERT INTO tarefa (id_usuario, descricao, setor, prioridade)
         VALUES ($1,$2,$3,$4) RETURNING *`,
        [id_usuario, descricao, setor, prioridade]
    );

    res.json(result.rows[0]);
});

// Listar
router.get('/', async (req, res) => {
    const result = await db.query(`
        SELECT t.*, u.nome as usuario
        FROM tarefa t
        JOIN usuario u ON u.id = t.id_usuario
    `);

    res.json(result.rows);
});

// Atualizar tarefa (EDITAR)
router.put('/:id', async (req, res) => {
    const { descricao, setor, prioridade } = req.body;

    await db.query(
        `UPDATE tarefa 
         SET descricao=$1, setor=$2, prioridade=$3
         WHERE id=$4`,
        [descricao, setor, prioridade, req.params.id]
    );

    res.json();
});

// Alterar status
router.put('/:id/status', async (req, res) => {
    const { status } = req.body;

    await db.query(
        'UPDATE tarefa SET status=$1 WHERE id=$2',
        [status, req.params.id]
    );

    res.json();
});

// Deletar
router.delete('/:id', async (req, res) => {
    await db.query(
        'DELETE FROM tarefa WHERE id=$1',
        [req.params.id]
    );

    res.json();
});

module.exports = router;