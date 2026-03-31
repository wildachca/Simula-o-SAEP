const API = 'http://localhost:3000';

async function carregarUsuarios(selectId) {
  const res = await fetch(`${API}/usuarios`);
  const usuarios = await res.json();
  const select = document.getElementById(selectId);
  select.innerHTML = '';
  usuarios.forEach(u => {
    const opt = document.createElement('option');
    opt.value = u.id;
    opt.text = u.nome;
    select.appendChild(opt);
  });
}

document.getElementById('form-usuario')?.addEventListener('submit', async e => {
  e.preventDefault();
  const nome = document.getElementById('nome').value;
  const email = document.getElementById('email').value;
  if (!nome || !email) return alert('Preencha todos os campos');
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(email)) return alert('E-mail inválido');
  await fetch(`${API}/usuarios`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nome, email })
  });
  alert('Usuário cadastrado com sucesso');
  document.getElementById('form-usuario').reset();
  carregarUsuarios('usuario-tarefa');
});

document.getElementById('form-tarefa')?.addEventListener('submit', async e => {
  e.preventDefault();
  const id_usuario = document.getElementById('usuario-tarefa').value;
  const descricao = document.getElementById('descricao').value;
  const setor = document.getElementById('setor').value;
  const prioridade = document.getElementById('prioridade').value;
  if (!id_usuario || !descricao || !setor || !prioridade) return alert('Preencha todos os campos');
  await fetch(`${API}/tarefas`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id_usuario, descricao, setor, prioridade })
  });
  alert('Tarefa cadastrada com sucesso');
  document.getElementById('form-tarefa').reset();
});

let tarefas = [];
let usuarios = [];
let tarefaAtual = null;

async function carregarTarefas() {
  const res = await fetch(`${API}/tarefas`);
  tarefas = await res.json();
  renderizarTarefas();
}

function renderizarTarefas() {
  ['a-fazer','fazendo','pronto'].forEach(id => document.getElementById(id).innerHTML = '');
  tarefas.forEach(t => {
    const card = document.createElement('div');
    card.className = 'card p-2 mb-2 tarefa-card';
    card.innerHTML = `<strong>${t.descricao}</strong><br>
      <small>Setor: ${t.setor}</small><br>
      <small>Prioridade: ${t.prioridade}</small><br>
      <small>Usuário: ${t.usuario_nome}</small>`;
    card.onclick = () => abrirModal(t);
    if(t.status==='a fazer') document.getElementById('a-fazer').appendChild(card);
    if(t.status==='fazendo') document.getElementById('fazendo').appendChild(card);
    if(t.status==='pronto') document.getElementById('pronto').appendChild(card);
  });
}

function abrirModal(tarefa) {
  tarefaAtual = tarefa;
  document.getElementById('edit-usuario').value = tarefa.id_usuario;
  document.getElementById('edit-descricao').value = tarefa.descricao;
  document.getElementById('edit-setor').value = tarefa.setor;
  document.getElementById('edit-prioridade').value = tarefa.prioridade;
  document.getElementById('edit-status').value = tarefa.status;
  const modal = new bootstrap.Modal(document.getElementById('editarModal'));
  modal.show();
}

document.getElementById('btnSalvar')?.addEventListener('click', async () => {
  const updated = {
    id_usuario: document.getElementById('edit-usuario').value,
    descricao: document.getElementById('edit-descricao').value,
    setor: document.getElementById('edit-setor').value,
    prioridade: document.getElementById('edit-prioridade').value,
    status: document.getElementById('edit-status').value
  };
  await fetch(`${API}/tarefas/${tarefaAtual.id}`, {
    method:'PUT',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify(updated)
  });
  carregarTarefas();
  bootstrap.Modal.getInstance(document.getElementById('editarModal')).hide();
});

document.getElementById('btnExcluir')?.addEventListener('click', async () => {
  if(confirm('Deseja realmente excluir esta tarefa?')){
    await fetch(`${API}/tarefas/${tarefaAtual.id}`, { method:'DELETE' });
    carregarTarefas();
    bootstrap.Modal.getInstance(document.getElementById('editarModal')).hide();
  }
});

window.onload = async () => {
  await carregarUsuarios('usuario-tarefa');
  await carregarUsuarios('edit-usuario');
  await carregarTarefas();
};