const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/usuarios', require('./routes/usuarios'));
app.use('/tarefas', require('./routes/tarefas'));

app.listen(3000, () => console.log('Servidor rodando'));