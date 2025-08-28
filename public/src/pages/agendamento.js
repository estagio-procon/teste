// Utilidades mascaras simples (CPF)
const cpf = document.getElementById('cpf');
cpf.addEventListener('input', () => {
  let v = cpf.value.replace(/\D/g, '').slice(0, 11);
  let r = '';
  if (v.length > 9) r = v.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, '$1.$2.$3-$4');
  else if (v.length > 6) r = v.replace(/(\d{3})(\d{3})(\d{0,3})/, '$1.$2.$3');
  else if (v.length > 3) r = v.replace(/(\d{3})(\d{0,3})/, '$1.$2');
  else r = v;
  cpf.value = r;
});
const listaHorarios = document.getElementById('lista-horarios');
const hiddenHorario = document.getElementById('horario');
const inputData = document.getElementById('data');
function gerarHorarios(d) {
  listaHorarios.innerHTML = '';
  hiddenHorario.value = '';
  if (!d) return;
  const date = new Date(d + 'T12:00:00');
  // Desabilita fins de semana
  const dow = date.getUTCDay(); // 0 dom, 6 sáb
  if (dow === 0 || dow === 6) {
    const msg = document.createElement('div');
    msg.textContent = 'Sem atendimento em fins de semana. Escolha um dia útil.';
    msg.style.color = '#9ca3af';
    listaHorarios.appendChild(msg);
    return;
  }
  const makeBtn = (t) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'time-btn';
    b.setAttribute('role', 'radio');
    b.setAttribute('aria-pressed', 'false');
    b.textContent = t;
    b.addEventListener('click', () => {
      document.querySelectorAll('.time-btn[aria-pressed="true"]').forEach(x => x.setAttribute('aria-pressed', 'false'));
      b.setAttribute('aria-pressed', 'true');
      hiddenHorario.value = t;
    });
    return b;
  };
  const slots = [];
  const push = (h, m) => slots.push(String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0'));
  for (let h = 8; h <= 17; h++) {
    for (let m = 0; m < 60; m += 30) {
      if (h === 12 || h === 13) continue; // intervalo de almoço
      if (h === 17 && m > 0) continue; // último 17:00
      push(h, m);
    }
  }
  // Exemplo de bloqueio aleatório
  const indisponiveis = new Set();
  for (let i = 0; i < 3; i++) {
    const idx = Math.floor(Math.random() * slots.length);
    indisponiveis.add(slots[idx]);
  }
  slots.forEach(t => {
    const b = makeBtn(t);
    if (indisponiveis.has(t)) {
      b.disabled = true; b.title = 'Horário indisponível'; b.style.opacity = .6;
    }
    listaHorarios.appendChild(b);
  });
}
inputData.addEventListener('change', e => gerarHorarios(e.target.value));
// Limpar
document.getElementById('btn-limpar').addEventListener('click', () => {
  document.getElementById('form-agendamento').reset();
  listaHorarios.innerHTML = '';
  document.getElementById('resumo').style.display = 'none';
});
// Submit com validação básica e resumo
document.getElementById('form-agendamento').addEventListener('submit', (e) => {
  e.preventDefault();
  const form = e.currentTarget;
  const obrigatorios = ['nome', 'cpf', 'municipio', 'unidade', 'servico', 'data', 'horario'];
  let ok = true;
  obrigatorios.forEach(id => {
    const el = document.getElementById(id);
    if (!el.value) { ok = false; el.scrollIntoView({ behavior: 'smooth', block: 'center' }); el.focus(); }
  });
  if (!ok) return;
  const dados = Object.fromEntries(new FormData(form).entries());
  const resumo = document.getElementById('resumo');
  resumo.innerHTML = `
    <strong>Agendamento confirmado!</strong><br>
    <div style="margin-top:6px">
      <div><b>Nome:</b> ${dados.nome}</div>
      <div><b>CPF:</b> ${dados.cpf}</div>
      <div><b>Município/Unidade:</b> ${dados.municipio} – ${dados.unidade}</div>
      <div><b>Serviço:</b> ${dados.servico}</div>
      <div><b>Data/Horário:</b> ${new Date(dados.data + 'T12:00:00').toLocaleDateString('pt-BR')} às ${dados.horario}</div>
      ${dados.telefone ? `<div><b>Telefone:</b> ${dados.telefone}</div>` : ''}
      ${dados.email ? `<div><b>E‑mail:</b> ${dados.email}</div>` : ''}
      ${dados.observacoes ? `<div><b>Observações:</b> ${dados.observacoes}</div>` : ''}
    </div>
  `;
  resumo.style.display = 'block';
  resumo.scrollIntoView({ behavior: 'smooth' });
});
// Sugestão: Define a data mínima como amanhã
const hoje = new Date();
hoje.setDate(hoje.getDate() + 1);
const y = hoje.getFullYear();
const m = String(hoje.getMonth() + 1).padStart(2, '0');
const d = String(hoje.getDate()).padStart(2, '0');
inputData.min = `${y}-${m}-${d}`;
const telefone = document.querySelector('input[name="telefone"]');
if (telefone) {
  telefone.addEventListener('input', function (e) {
    let value = e.target.value.replace(/\D/g, '');
    value = value.substring(0, 11);
    if (value.length > 0) {
      if (value.length <= 2) {
        value = value.replace(/^(\d{0,2})/, '($1');
      } else if (value.length <= 3) {
        value = value.replace(/^(\d{2})(\d{0,1})/, '($1) $2');
      } else if (value.length <= 7) {
        value = value.replace(/^(\d{2})(\d{1})(\d{0,4})/, '($1) $2 $3');
      } else {
        value = value.replace(/^(\d{2})(\d{1})(\d{4})(\d{0,4})/, '($1) $2 $3-$4');
      }
    }
    e.target.value = value;
  });
} 