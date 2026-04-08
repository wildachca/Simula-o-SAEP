const API = "http://localhost:3000";

async function carregarUsuarios(){
    const res = await fetch(API+"/usuarios");
    const data = await res.json();
    const select = document.getElementById("usuario");
    if(!select) return;
    data.forEach(u=>{
        select.innerHTML += `<option value="${u.id}">${u.nome}</option>`;
    });
}

async function cadastrarUsuario(){
    await fetch(API+"/usuarios",{
        method:"POST",
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({
            nome:document.getElementById("nome").value,
            email:document.getElementById("email").value
        })
    });
    alert("Cadastrado");
}

async function cadastrarTarefa(){
    await fetch(API+"/tarefas",{
        method:"POST",
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({
            descricao:descricao.value,
            setor:setor.value,
            id_usuario:usuario.value,
            prioridade:prioridade.value
        })
    });
    alert("Tarefa criada");
}

async function carregarTarefas(){
    const res = await fetch(API+"/tarefas");
    const tarefas = await res.json();

    tarefas.forEach(t=>{
        const card=document.createElement("div");
        card.className="card";
        card.innerHTML=`
        ${t.descricao}<br>
        ${t.setor}<br>
        ${t.prioridade}<br>
        ${t.usuario}
        `;

        document.getElementById(t.status.replace(" ","")).appendChild(card);
    });
}