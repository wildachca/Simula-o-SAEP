const API = "http://localhost:3000";

// VALIDAR EMAIL
function emailValido(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// USUÁRIOS
async function cadastrarUsuario() {
    const nome = nomeInput.value;
    const email = emailInput.value;

    if (!nome || !email) return alert("Preencha tudo");
    if (!emailValido(email)) return alert("Email inválido");

    await fetch(API + "/usuarios", {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({ nome, email })
    });

    alert("Usuário cadastrado!");
}

// CARREGAR USUÁRIOS
async function carregarUsuarios() {
    const res = await fetch(API + "/usuarios");
    const usuarios = await res.json();

    const select = document.getElementById("usuario");
    if (!select) return;

    usuarios.forEach(u => {
        select.innerHTML += `<option value="${u.id}">${u.nome}</option>`;
    });
}

// CADASTRAR TAREFA
async function cadastrarTarefa() {
    if (!descricao.value || !setor.value) return alert("Preencha tudo");

    await fetch(API + "/tarefas", {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({
            descricao: descricao.value,
            setor: setor.value,
            id_usuario: usuario.value,
            prioridade: prioridade.value
        })
    });

    alert("Tarefa criada!");
}

// CARREGAR KANBAN
async function carregarTarefas() {
    const res = await fetch(API + "/tarefas");
    const tarefas = await res.json();

    document.getElementById("AFazer").innerHTML = "";
    document.getElementById("Fazendo").innerHTML = "";
    document.getElementById("Pronto").innerHTML = "";

    tarefas.forEach(t => {
        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
        <b>${t.descricao}</b><br>
        ${t.setor}<br>
        ${t.prioridade}<br>
        ${t.usuario}<br><br>

        <button onclick="mudarStatus(${t.id}, 'A Fazer')">A Fazer</button>
        <button onclick="mudarStatus(${t.id}, 'Fazendo')">Fazendo</button>
        <button onclick="mudarStatus(${t.id}, 'Pronto')">Pronto</button><br><br>

        <button onclick="editar(${t.id}, '${t.descricao}', '${t.setor}', '${t.prioridade}')">Editar</button>
        <button onclick="deletar(${t.id})">Excluir</button>
        `;

        document.getElementById(t.status.replace(" ", "")).appendChild(card);
    });
}

// MUDAR STATUS
async function mudarStatus(id, status) {
    await fetch(API + `/tarefas/${id}/status`, {
        method: "PUT",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({ status })
    });

    carregarTarefas();
}

// DELETAR
async function deletar(id) {
    if (!confirm("Tem certeza?")) return;

    await fetch(API + `/tarefas/${id}`, { method: "DELETE" });

    carregarTarefas();
}

// EDITAR (SIMPLES)
function editar(id, desc, set, pri) {
    const novaDesc = prompt("Descrição:", desc);
    const novoSet = prompt("Setor:", set);
    const novaPri = prompt("Prioridade:", pri);

    fetch(API + `/tarefas/${id}`, {
        method: "PUT",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({
            descricao: novaDesc,
            setor: novoSet,
            prioridade: novaPri
        })
    }).then(() => carregarTarefas());
}