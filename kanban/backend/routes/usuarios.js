const router = require('express').Router();
const db = require('../db');

router.post('/', async (req, res) => {
    const { nome, email } = req.body;

    if (!nome || !email) return res.status(400).json();

    const result = await db.query(
        'INSERT INTO usuario (nome,email) VALUES ($1,$2) RETURNING *',
        [nome, email]
    );

    res.json(result.rows[0]);
});

router.get('/', async (req, res) => {
    const result = await db.query('SELECT * FROM usuario');
    res.json(result.rows);
});

module.exports = router;