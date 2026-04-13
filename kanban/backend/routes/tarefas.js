const router = require('express').Router();
const db = require('../db');

// Criar tarefa
router.post('/', async (req, res) => {
    try {
        const { id_usuario, descricao, setor, prioridade } = req.body;

        if (!id_usuario || !descricao || !setor || !prioridade) {
            return res.status(400).json({ erro: "Preencha todos os campos" });
        }

        const prioridadesValidas = ['baixa', 'media', 'alta'];
        if (!prioridadesValidas.includes(prioridade)) {
            return res.status(400).json({ erro: "Prioridade inválida" });
        }

        const result = await db.query(
            `INSERT INTO tarefa (id_usuario, descricao, setor, prioridade)
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [id_usuario, descricao, setor, prioridade]
        );

        res.json(result.rows[0]);

    } catch (err) {
        console.log(err);
        res.status(500).json({ erro: "Erro ao criar tarefa" });
    }
});

// Listar tarefas
router.get('/', async (req, res) => {
    try {
        const result = await db.query(`
            SELECT t.*, u.nome AS usuario
            FROM tarefa t
            JOIN usuario u ON u.id = t.id_usuario
        `);

        res.json(result.rows);

    } catch (err) {
        console.log(err);
        res.status(500).json({ erro: "Erro ao buscar tarefas" });
    }
});

// Editar tarefa
router.put('/:id', async (req, res) => {
    try {
        const { descricao, setor, prioridade } = req.body;

        if (!descricao || !setor || !prioridade) {
            return res.status(400).json({ erro: "Dados inválidos" });
        }

        await db.query(
            `UPDATE tarefa 
             SET descricao = $1, setor = $2, prioridade = $3
             WHERE id = $4`,
            [descricao, setor, prioridade, req.params.id]
        );

        res.json({ mensagem: "Atualizado com sucesso" });

    } catch (err) {
        console.log(err);
        res.status(500).json({ erro: "Erro ao atualizar tarefa" });
    }
});

// Alterar status
router.put('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;

        const statusValidos = ['a fazer', 'fazendo', 'pronto'];
        if (!statusValidos.includes(status)) {
            return res.status(400).json({ erro: "Status inválido" });
        }

        await db.query(
            'UPDATE tarefa SET status = $1 WHERE id = $2',
            [status, req.params.id]
        );

        res.json({ mensagem: "Status atualizado" });

    } catch (err) {
        console.log(err);
        res.status(500).json({ erro: "Erro ao atualizar status" });
    }
});

// Deletar tarefa
router.delete('/:id', async (req, res) => {
    try {
        await db.query(
            'DELETE FROM tarefa WHERE id = $1',
            [req.params.id]
        );

        res.json({ mensagem: "Deletado com sucesso" });

    } catch (err) {
        console.log(err);
        res.status(500).json({ erro: "Erro ao deletar tarefa" });
    }
});

module.exports = router;