const router = require('express').Router();
const db = require('../db');

router.post('/', async (req, res) => {
    try {
        const { nome, email } = req.body;

        if (!nome || !email) {
            return res.status(400).json({ erro: "Preencha todos os campos" });
        }

        if (!email.includes("@")) {
            return res.status(400).json({ erro: "Email inválido" });
        }

        const result = await db.query(
            'INSERT INTO usuario (nome,email) VALUES ($1,$2) RETURNING *',
            [nome, email]
        );

        res.json(result.rows[0]);

    } catch (err) {
        res.status(500).json({ erro: "Erro no servidor" });
    }
});

router.get('/', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM usuario');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ erro: "Erro ao buscar usuários" });
    }
});

module.exports = router;