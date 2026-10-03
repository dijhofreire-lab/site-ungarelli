const defaultNoticias = [
  {titulo:"Portal Escolar Dom Ungarelli entra em nova fase", descricao:"Um novo espaço digital para aproximar estudantes, professores, famílias e comunidade.", autor:"Comunidade Escolar"},
  {titulo:"Estudantes ganham espaço para divulgar projetos", descricao:"A Área do Aluno permite o envio de notícias, projetos e eventos para análise e publicação.", autor:"Equipe de Informática"},
  {titulo:"Eletivas fortalecem o protagonismo estudantil", descricao:"Conheça algumas das experiências desenvolvidas pelos estudantes nas eletivas da escola.", autor:"Coordenação Pedagógica"}
];

const defaultEventos = [
  {titulo:"Aula regular e atividades pedagógicas", horario:"07:30", local:"Salas de aula"},
  {titulo:"Atividades das Eletivas", horario:"10:00", local:"Espaços pedagógicos"},
  {titulo:"Atendimento aos estudantes", horario:"14:00", local:"Coordenação"}
];

const projetos = [
  {titulo:"Comunicação da Palavra", descricao:"Produção de jornal digital escolar, leitura, escrita e comunicação responsável.", img:"img/comunicacao-da-palavra.jpeg"},
  {titulo:"Conhecimento Social Investigativo", descricao:"Pesquisa e investigação social a partir de situações-problema.", img:"img/conhecimento-social-investigativo.jpeg"},
  {titulo:"Game of Numbers", descricao:"Estratégia, matemática e desafios para aprender de forma dinâmica.", img:"img/game-of-numbers.jpeg"},
  {titulo:"Razão em Dobro", descricao:"Filosofia e matemática trabalhando pensamento, estratégia e tomada de decisão.", img:"img/razao-em-dobro.jpeg"},
  {titulo:"Vozes Ancestrais", descricao:"História, cultura, memória e valorização das identidades.", img:"img/vozes-ancestrais.jpeg"}
];

function getData(key, fallback){
  try {
    const saved = JSON.parse(localStorage.getItem(key));
    return Array.isArray(saved) && saved.length ? saved : fallback;
  } catch { return fallback; }
}
function saveData(key, data){ localStorage.setItem(key, JSON.stringify(data)); }

function renderNoticias(){
  const data = getData("domNoticias", defaultNoticias);
  document.getElementById("noticiasGrid").innerHTML = data.map((n,i)=>`
    <article class="news-card">
      <div class="news-image">${["📰","🎓","📢","💡"][i%4]}</div>
      <div class="news-body">
        <div class="date">${n.autor || "Comunidade Escolar"}</div>
        <h3>${escapeHtml(n.titulo)}</h3>
        <p>${escapeHtml(n.descricao)}</p>
      </div>
    </article>`).join("");
}

function renderProjetos(){
  document.getElementById("projetosGrid").innerHTML = projetos.map(p=>`
    <article class="project-card">
      <img src="${p.img}" alt="${escapeHtml(p.titulo)}">
      <div class="project-body"><span>PROJETO / ELETIVA</span><h3>${escapeHtml(p.titulo)}</h3><p>${escapeHtml(p.descricao)}</p></div>
    </article>`).join("");
}

function renderEventos(){
  const data = getData("domEventos", defaultEventos).sort((a,b)=>a.horario.localeCompare(b.horario));
  document.getElementById("eventosGrid").innerHTML = data.map(e=>`
    <article class="event-card">
      <div class="event-time">${escapeHtml(e.horario)}<small>horário</small></div>
      <div><h3>${escapeHtml(e.titulo)}</h3><p>📍 ${escapeHtml(e.local || "A definir")}</p></div>
      <span class="event-tag today-pill">HOJE</span>
    </article>`).join("");
}

function escapeHtml(value){
  return String(value ?? "").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));
}

function showMessage(text){
  const el=document.getElementById("formMessage");
  el.textContent=text;
  setTimeout(()=>el.textContent="",3500);
}

document.querySelector(".menu-toggle").addEventListener("click",()=>{
  document.querySelector(".nav").classList.toggle("open");
});

document.querySelectorAll(".tab").forEach(tab=>{
  tab.addEventListener("click",()=>{
    document.querySelectorAll(".tab").forEach(t=>t.classList.remove("active"));
    document.querySelectorAll(".publish-form").forEach(f=>f.classList.remove("active-form"));
    tab.classList.add("active");
    document.getElementById("form"+tab.dataset.form.charAt(0).toUpperCase()+tab.dataset.form.slice(1)).classList.add("active-form");
  });
});

document.getElementById("formNoticia").addEventListener("submit",e=>{
  e.preventDefault();
  const data=getData("domNoticias",defaultNoticias);
  data.unshift({
    titulo:document.getElementById("noticiaTitulo").value,
    descricao:document.getElementById("noticiaDescricao").value,
    autor:document.getElementById("noticiaAutor").value || "Estudante"
  });
  saveData("domNoticias",data); renderNoticias(); e.target.reset(); showMessage("Notícia adicionada ao portal!");
});

document.getElementById("formEvento").addEventListener("submit",e=>{
  e.preventDefault();
  const data=getData("domEventos",defaultEventos);
  data.push({
    titulo:document.getElementById("eventoTitulo").value,
    horario:document.getElementById("eventoHorario").value,
    local:document.getElementById("eventoLocal").value || "A definir"
  });
  saveData("domEventos",data); renderEventos(); e.target.reset(); showMessage("Evento adicionado à agenda!");
});

document.getElementById("formProjeto").addEventListener("submit",e=>{
  e.preventDefault();
  const data=getData("domNoticias",defaultNoticias);
  data.unshift({
    titulo:document.getElementById("projetoTitulo").value,
    descricao:document.getElementById("projetoDescricao").value,
    autor:document.getElementById("projetoAutor").value || "Projeto estudantil"
  });
  saveData("domNoticias",data); renderNoticias(); e.target.reset(); showMessage("Projeto enviado para a área de notícias!");
});

const hoje = new Date();
const formatado = hoje.toLocaleDateString("pt-BR",{weekday:"long",day:"2-digit",month:"long",year:"numeric"});
document.getElementById("dataAtual").textContent = formatado;
document.getElementById("eventoData").textContent = formatado;
document.getElementById("ano").textContent = hoje.getFullYear();

renderNoticias();
renderProjetos();
renderEventos();
