const API = 'https://ghibliapi.vercel.app/films';

let filmes = [];

fetch(API)
  .then(function(res) {
    if (!res.ok) throw new Error('Erro HTTP: ' + res.status);
    return res.json();
  })
  .then(function(data) {
    filmes = data;
    document.getElementById('status').textContent = '';
    renderizar(filmes);
  })
  .catch(function(erro) {
    document.getElementById('status').textContent = 'Erro ao carregar: ' + erro.message;
  });

function renderizar(lista) {
  var grid = document.getElementById('grid');
  grid.innerHTML = '';

  if (lista.length === 0) {
    grid.innerHTML = '<p style="text-align:center;color:#888;padding:2rem;">Nenhum filme encontrado.</p>';
    return;
  }

  lista.forEach(function(filme) {
    var card = document.createElement('div');
    card.className = 'card';
    card.innerHTML =
      '<div class="ano">' + (filme.release_date || '—') + '</div>' +
      '<h3>' + filme.title + '</h3>' +
      '<div class="original">' + (filme.original_title || '') + '</div>' +
      '<p class="desc">' + (filme.description || '') + '</p>' +
      '<div class="rodape">' +
        '<span class="nota">★ ' + (filme.rt_score || '—') + '%</span>' +
        '<span class="diretor">' + (filme.director || '') + '</span>' +
      '</div>';
    card.addEventListener('click', function() {
      abrirModal(filme);
    });
    grid.appendChild(card);
  });
}

function abrirModal(filme) {
  var conteudo = document.getElementById('modal-conteudo');
  conteudo.innerHTML =
    '<h2>' + filme.title + '</h2>' +
    '<div class="original-modal">' + (filme.original_title || '') + ' ' + (filme.original_title_romanised || '') + '</div>' +
    '<div class="tags">' +
      (filme.release_date ? '<span class="tag tag-ano">📅 ' + filme.release_date + '</span>' : '') +
      (filme.rt_score ? '<span class="tag tag-nota">★ ' + filme.rt_score + '%</span>' : '') +
      (filme.running_time ? '<span class="tag tag-dur">⏱️ ' + filme.running_time + ' min</span>' : '') +
    '</div>' +
    '<div class="secao-titulo">Sinopse</div>' +
    '<p class="descricao-modal">' + (filme.description || 'Sem descrição.') + '</p>' +
    '<div class="secao-titulo">Ficha Técnica</div>' +
    '<div class="info-grid">' +
      (filme.director ? '<div class="info-item"><span class="label">Diretor</span><span class="valor">' + filme.director + '</span></div>' : '') +
      (filme.producer ? '<div class="info-item"><span class="label">Produtor</span><span class="valor">' + filme.producer + '</span></div>' : '') +
      (filme.release_date ? '<div class="info-item"><span class="label">Ano</span><span class="valor">' + filme.release_date + '</span></div>' : '') +
      (filme.running_time ? '<div class="info-item"><span class="label">Duração</span><span class="valor">' + filme.running_time + ' min</span></div>' : '') +
    '</div>';
  document.getElementById('modal').classList.remove('escondido');
}

document.getElementById('fechar').addEventListener('click', function() {
  document.getElementById('modal').classList.add('escondido');
});

document.getElementById('modal').addEventListener('click', function(e) {
  if (e.target === this) this.classList.add('escondido');
});

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') document.getElementById('modal').classList.add('escondido');
});

document.getElementById('busca').addEventListener('input', function() {
  var termo = this.value.toLowerCase();
  var filtrados = filmes.filter(function(f) {
    return (
      f.title.toLowerCase().includes(termo) ||
      (f.director && f.director.toLowerCase().includes(termo)) ||
      (f.description && f.description.toLowerCase().includes(termo))
    );
  });
  renderizar(filtrados);
});