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
document.addEventListener('DOMContentLoaded', function () {
  // Selecionar todos os elementos do formulário
  const form = document.querySelector('form');
  const btnSubmit = document.querySelector('button[type="submit"]');
  const btnLimpar = document.getElementById('btn-limpar');

  // Elementos dos inputs
  const nomeInput = document.getElementById('nome');
  const cpfInput = document.getElementById('cpf');
  const emailInputs = document.querySelectorAll('input[type="email"][name="email"]');
  const telefoneInput = document.getElementById('telefone');
  const municipioSelect = document.getElementById('municipio');
  const unidadeSelect = document.getElementById('unidade');
  const servicoSelect = document.getElementById('servico');
  const dataInput = document.getElementById('data');
  const horarioHidden = document.getElementById('horario');

  // Verificar se elementos existem
  if (emailInputs.length < 2 || !btnSubmit || !btnLimpar) {
    console.error('Elementos não encontrados');
    return;
  }

  const primeiroEmail = emailInputs[0];
  const segundoEmail = emailInputs[1];

  // Criar elementos para mensagens de erro
  function criarMensagemErro(input, mensagem) {
    // Remover mensagem anterior se existir
    const erroAnterior = input.parentNode.querySelector('.error-message');
    if (erroAnterior) {
      erroAnterior.remove();
    }

    if (mensagem) {
      const errorMessage = document.createElement('div');
      errorMessage.className = 'error-message';
      errorMessage.style.color = 'red';
      errorMessage.style.fontSize = '12px';
      errorMessage.style.marginTop = '4px';
      errorMessage.textContent = mensagem;
      input.parentNode.appendChild(errorMessage);
    }
  }

  // Validações individuais
  function validarNome() {
    const valor = nomeInput.value.trim();
    if (!valor) {
      return { isValid: false, message: 'Nome é obrigatório' };
    }
    if (valor.length < 3) {
      return { isValid: false, message: 'Nome deve ter pelo menos 3 caracteres' };
    }
    return { isValid: true, message: '' };
  }

  function validarCPF() {
    const valor = cpfInput.value.trim();
    if (!valor) {
      return { isValid: false, message: 'CPF é obrigatório' };
    }
    const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
    if (!cpfRegex.test(valor)) {
      return { isValid: false, message: 'Formato inválido (use: 000.000.000-00)' };
    }
    return { isValid: true, message: '' };
  }

  function validarEmails() {
    const valorPrimeiroEmail = primeiroEmail.value.trim();
    const valorSegundoEmail = segundoEmail.value.trim();

    if (!valorPrimeiroEmail || !valorSegundoEmail) {
      return { isValid: false, message: '' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(valorPrimeiroEmail)) {
      return { isValid: false, message: 'Formato de email inválido!' };
    }

    if (valorPrimeiroEmail !== valorSegundoEmail) {
      return { isValid: false, message: 'Os emails não coincidem!' };
    }

    return { isValid: true, message: '' };
  }

  function validarTelefone() {
    const valor = telefoneInput.value.trim();
    if (!valor) {
      return { isValid: false, message: 'Telefone é obrigatório' };
    }
    const telefoneRegex = /^\(\d{2}\) \d{4,5}-\d{4}$/;
    if (!telefoneRegex.test(valor)) {
      return { isValid: false, message: 'Formato inválido (use: (98) 90000-0000)' };
    }
    return { isValid: true, message: '' };
  }

  function validarSelect(select, campo) {
    if (!select.value) {
      return { isValid: false, message: `${campo} é obrigatório` };
    }
    return { isValid: true, message: '' };
  }

  function validarData() {
    const valor = dataInput.value;
    if (!valor) {
      return { isValid: false, message: 'Data é obrigatória' };
    }

    // Usar a data atual no formato YYYY-MM-DD para comparação
    const hoje = new Date();   
    const hojeFormatado = hoje.toISOString().split('T')[0];

    if (valor < hojeFormatado) {
      return { isValid: false, message: 'Não é possível agendar para datas passadas' };
    }

    return { isValid: true, message: '' };
  }

  function validarHorario() {
    if (!horarioHidden.value) {
      return { isValid: false, message: 'Horário é obrigatório' };
    }
    return { isValid: true, message: '' };
  }

  // Função principal de validação
  function validarFormulario() {
    const validacoes = {
      nome: validarNome(),
      cpf: validarCPF(),
      emails: validarEmails(),
      telefone: validarTelefone(),
      municipio: validarSelect(municipioSelect, 'Município'),
      unidade: validarSelect(unidadeSelect, 'Unidade'),
      servico: validarSelect(servicoSelect, 'Serviço'),
      data: validarData(),
      horario: validarHorario()
    };

    return validacoes;
  }

  // Atualizar estado do botão submit
  function atualizarEstadoSubmit() {
    const validacoes = validarFormulario();
    const todosValidos = Object.values(validacoes).every(v => v.isValid);

    btnSubmit.disabled = !todosValidos;

    if (todosValidos) {
      btnSubmit.style.opacity = '1';
      btnSubmit.style.cursor = 'pointer';
    } else {
      btnSubmit.style.opacity = '0.6';
      btnSubmit.style.cursor = 'not-allowed';
    }
  }

  // Mostrar erros específicos
  function mostrarErros() {
    const validacoes = validarFormulario();

    criarMensagemErro(nomeInput, validacoes.nome.message);
    criarMensagemErro(cpfInput, validacoes.cpf.message);
    criarMensagemErro(segundoEmail, validacoes.emails.message);
    criarMensagemErro(telefoneInput, validacoes.telefone.message);
    criarMensagemErro(municipioSelect, validacoes.municipio.message);
    criarMensagemErro(unidadeSelect, validacoes.unidade.message);
    criarMensagemErro(servicoSelect, validacoes.servico.message);
    criarMensagemErro(dataInput, validacoes.data.message);

    // Para horário, mostrar mensagem perto do radiogroup
    const listaHorarios = document.getElementById('lista-horarios');
    criarMensagemErro(listaHorarios, validacoes.horario.message);
  }

  // Adicionar event listeners para todos os campos
  const camposValidacao = [
    nomeInput, cpfInput, primeiroEmail, segundoEmail, telefoneInput,
    municipioSelect, unidadeSelect, servicoSelect, dataInput
  ];

  camposValidacao.forEach(campo => {
    campo.addEventListener('input', function () {
      mostrarErros();
      atualizarEstadoSubmit();
    });

    campo.addEventListener('blur', function () {
      mostrarErros();
      atualizarEstadoSubmit();
    });
  });

  // Para os selects
  [municipioSelect, unidadeSelect, servicoSelect].forEach(select => {
    select.addEventListener('change', function () {
      mostrarErros();
      atualizarEstadoSubmit();
    });
  });

  // Para o horário (assumindo que há um evento quando seleciona horário)
  if (horarioHidden) {
    // Observar mudanças no hidden field
    const observer = new MutationObserver(function () {
      mostrarErros();
      atualizarEstadoSubmit();
    });

    observer.observe(horarioHidden, { attributes: true, attributeFilter: ['value'] });
  }

  // Event listener para o botão limpar
  btnLimpar.addEventListener('click', function () {
    // Limpar todos os campos
    nomeInput.value = '';
    cpfInput.value = '';
    primeiroEmail.value = '';
    segundoEmail.value = '';
    telefoneInput.value = '';
    municipioSelect.value = '';
    unidadeSelect.value = '';
    servicoSelect.value = '';
    dataInput.value = '';
    horarioHidden.value = '';

    // Limpar mensagens de erro
    document.querySelectorAll('.error-message').forEach(msg => msg.remove());

    atualizarEstadoSubmit();
  });

  // Event listener para o submit do formulário
  form.addEventListener('submit', function (event) {
    const validacoes = validarFormulario();
    const todosValidos = Object.values(validacoes).every(v => v.isValid);

    if (!todosValidos) {
      event.preventDefault();
      mostrarErros();
      alert('Por favor, corrija os erros no formulário antes de enviar.');

      // Focar no primeiro campo com erro
      const camposComErro = [
        { campo: nomeInput, valido: validacoes.nome.isValid },
        { campo: cpfInput, valido: validacoes.cpf.isValid },
        { campo: primeiroEmail, valido: validacoes.emails.isValid },
        { campo: telefoneInput, valido: validacoes.telefone.isValid },
        { campo: municipioSelect, valido: validacoes.municipio.isValid },
        { campo: unidadeSelect, valido: validacoes.unidade.isValid },
        { campo: servicoSelect, valido: validacoes.servico.isValid },
        { campo: dataInput, valido: validacoes.data.isValid }
      ];

      const primeiroErro = camposComErro.find(campo => !campo.valido);
      if (primeiroErro) {
        primeiroErro.campo.focus();
      }
    }
  });

  // Inicializar o estado do botão
  atualizarEstadoSubmit();
});

// Função para formatar CPF
function formatarCPF(cpf) {
  const cpfInput = document.getElementById('cpf');
  let valor = cpfInput.value.replace(/\D/g, '');

  if (valor.length <= 11) {
    valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
    valor = valor.replace(/(\d{3})\.(\d{3})(\d)/, '$1.$2.$3');
    valor = valor.replace(/(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4');
    valor = valor.substring(0, 14);
  }

  cpfInput.value = valor;
}

// Função para formatar telefone
function formatarTelefone(tel) {
  const telefoneInput = document.getElementById('telefone');
  let valor = tel.value.replace(/\D/g, '');

  if (valor.length <= 11) {
    valor = valor.replace(/(\d{2})(\d)/, '($1) $2');
    valor = valor.replace(/(\d{5})(\d)/, '$1-$2');
    valor = valor.substring(0, 15);
  }

  tel.value = valor;
}

// Adicionar formatação automática
document.addEventListener('DOMContentLoaded', function () {
  const cpfInput = document.getElementById('cpf');
  const telefoneInput = document.getElementById('telefone');

  if (cpfInput) {
    cpfInput.addEventListener('input', function () {
      formatarCPF(this);
    });
  }

  if (telefoneInput) {
    telefoneInput.addEventListener('input', function () {
      formatarTelefone(this);
    });
  }
});