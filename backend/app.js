const express = require('express');
const cors = require('cors');

const app = express();

const usuariosRoutes = require('./routes/usuarios');
const tarefasRoutes = require('./routes/tarefas');

app.use(cors());
app.use(express.json());

app.use('/usuarios', usuariosRoutes);
app.use('/tarefas', tarefasRoutes);

app.get('/', (req, res) => {
  res.send('API funcionando');
});

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});