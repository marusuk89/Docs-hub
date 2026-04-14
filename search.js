const ALL_SOURCES = [
  { file: './data/housing.json',     page: 'housing.html',     icon: '🏠', label: '주거 / 부동산' },
  { file: './data/legal.json',       page: 'legal.html',       icon: '⚖️', label: '법률 / 소송' },
  { file: './data/tax.json',         page: 'tax.html',         icon: '💰', label: '세금 / 금융' },
  { file: './data/welfare.json',     page: 'welfare.html',     icon: '🤝', label: '복지 / 지원금' },
  { file: './data/documents.json',   page: 'documents.html',   icon: '📋', label: '민원 서류 발급' },
  { file: './data/inheritance.json', page: 'inheritance.html', icon: '📦', label: '상속 / 증여' },
];

let index = [];

async function buildIndex() {
  const results = await Promise.all(
    ALL_SOURCES.map(src =>
      fetch(src.file)
        .then(r => r.json())
        .then(data => data.procedures.map(proc => ({ ...proc, ...src })))
    )
  );
  index = results.flat();
}

function search(query) {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  return index.filter(item => {
    const haystack = [
      item.title,
      item.description,
      item.tag,
      ...item.documents.map(d => d.name + ' ' + d.source),
      ...item.apply.map(a => a.name),
      item.notes || '',
    ].join(' ').toLowerCase();
    return haystack.includes(q);
  });
}

function renderResults(items, query) {
  const box = document.getElementById('search-results');
  if (!query.trim()) {
    box.innerHTML = '';
    box.style.display = 'none';
    return;
  }
  if (items.length === 0) {
    box.innerHTML = '<div class="search-empty">검색 결과가 없습니다.</div>';
    box.style.display = 'block';
    return;
  }

  box.innerHTML = items.map(item => `
    <a class="search-result-item" href="${item.page}#proc-${item.id}">
      <span class="search-result-icon">${item.icon}</span>
      <span class="search-result-body">
        <span class="search-result-title">${item.title}</span>
        <span class="search-result-category">${item.label}</span>
      </span>
      <span class="search-result-tag tag tag-${item.tag}">${item.tag}</span>
    </a>
  `).join('');
  box.style.display = 'block';
}

async function initSearch() {
  await buildIndex();

  const input = document.getElementById('search-input');
  const box   = document.getElementById('search-results');
  if (!input) return;

  input.addEventListener('input', () => {
    const q = input.value;
    renderResults(search(q), q);
  });

  // 외부 클릭 시 결과 닫기
  document.addEventListener('click', e => {
    if (!e.target.closest('#search-wrapper')) {
      box.style.display = 'none';
    }
  });

  input.addEventListener('focus', () => {
    if (input.value.trim()) renderResults(search(input.value), input.value);
  });
}

initSearch();
