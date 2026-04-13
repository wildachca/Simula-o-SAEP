- - Tabela de usuários
CREATE TABLE usuario (
id SERIAL PRIMARY KEY,
nome TEXT NOT NULL,
email TEXT NOT NULL UNIQUE CHECK (email LIKE '%@%.%')
);

- - Tabela de tarefas
CREATE TABLE tarefa (
id SERIAL PRIMARY KEY,
descricao TEXT NOT NULL,
setor TEXT NOT NULL,
prioridade TEXT NOT NULL CHECK (prioridade IN ('baixa','media','alta')),
status TEXT NOT NULL DEFAULT 'a fazer' CHECK (status IN ('a fazer','fazendo','pronto')),
data_cadastro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
id_usuario INTEGER NOT NULL,
CONSTRAINT fk_tarefa_usuario FOREIGN KEY (id_usuario)
REFERENCES usuario(id)
ON DELETE CASCADE
);