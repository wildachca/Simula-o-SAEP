const API = "http://localhost:3000";

function msg(texto) {
    document.getElementById("mensagem").innerText = texto;
}

// ================= USUÁRIOS =================

async function cadastrarUsuario() {
    const nome = nomeInput.value;
    const email = emailInput.value;

    if (!nome || !email) return msg("Preencha tudo");

    const res = await fetch(API + "/usuarios", {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({ nome, email })
    });

    const data = await res.json();

    if (data.erro) return msg(data.erro);

    msg("Usuário cadastrado!");
}

// ================= TAREFAS =================

async function carregarUsuarios() {
    const res = await fetch(API + "/usuarios");
    const usuarios = await res.json();

    const select = document.getElementById("usuario");
    if (!select) return;

    select.innerHTML = "<option value=''>Selecione</option>";

    usuarios.forEach(u => {
        select.innerHTML += `<option value="${u.id}">${u.nome}</option>`;
    });
}

function initTarefa() {
    carregarUsuarios();

    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    if (id) {
        carregarTarefa(id);
    } else {
        document.getElementById("botao").onclick = cadastrarTarefa;
    }
}

async function cadastrarTarefa() {
    const descricao = descricao.value;
    const setor = setor.value;
    const usuario = usuario.value;
    const prioridade = prioridade.value;

    if (!descricao || !setor || !usuario || !prioridade) {
        return msg("Preencha tudo");
    }

    await fetch(API + "/tarefas", {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({
            descricao,
            setor,
            id_usuario: usuario,
            prioridade
        })
    });

    msg("Tarefa criada!");
}

async function carregarTarefa(id) {
    const res = await fetch(API + "/tarefas");
    const tarefas = await res.json();

    const t = tarefas.find(t => t.id == id);

    descricao.value = t.descricao;
    setor.value = t.setor;
    usuario.value = t.id_usuario;
    prioridade.value = t.prioridade;

    document.getElementById("titulo").innerText = "Editar Tarefa";
    document.getElementById("botao").innerText = "Atualizar";

    document.getElementById("botao").onclick = () => atualizarTarefa(id);
}

async function atualizarTarefa(id) {
    await fetch(API + `/tarefas/${id}`, {
        method: "PUT",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({
            descricao: descricao.value,
            setor: setor.value,
            prioridade: prioridade.value
        })
    });

    window.location.href = "index.html";
}

// ================= KANBAN =================

async function carregarTarefas() {
    const res = await fetch(API + "/tarefas");
    const tarefas = await res.json();

    document.getElementById("afazer").innerHTML = "";
    document.getElementById("fazendo").innerHTML = "";
    document.getElementById("pronto").innerHTML = "";

    tarefas.forEach(t => {
        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
        <b>${t.descricao}</b><br>
        ${t.setor}<br>
        ${t.prioridade}<br>
        ${t.usuario}<br><br>

        <button onclick="mudarStatus(${t.id}, 'a fazer')">A Fazer</button>
        <button onclick="mudarStatus(${t.id}, 'fazendo')">Fazendo</button>
        <button onclick="mudarStatus(${t.id}, 'pronto')">Pronto</button><br><br>

        <button onclick="editar(${t.id})">Editar</button>
        <button onclick="deletar(${t.id})">Excluir</button>
        `;

        const coluna = t.status.replace(" ", "");
        document.getElementById(coluna).appendChild(card);
    });
}

function editar(id) {
    window.location.href = `tarefas.html?id=${id}`;
}

async function mudarStatus(id, status) {
    await fetch(API + `/tarefas/${id}/status`, {
        method: "PUT",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({ status })
    });

    carregarTarefas();
}

async function deletar(id) {
    if (!confirm("Tem certeza?")) return;

    await fetch(API + `/tarefas/${id}`, {
        method: "DELETE"
    });

    carregarTarefas();
}