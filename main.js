async function loadProcedures() {
  const file = (typeof DATA_FILE !== 'undefined' ? DATA_FILE : null) || './data/housing.json';
  const res = await fetch(file);
  const data = await res.json();
  return data.procedures;
}

function renderProcedure(proc) {
  const docsRows = proc.documents.map(doc => {
    const linkCell = doc.link
      ? `<a class="link-btn" href="${doc.link}" target="_blank" rel="noopener">바로가기 →</a>`
      : `<span class="no-link">직접 보관</span>`;
    return `
      <tr>
        <td class="doc-name">${doc.name}</td>
        <td class="doc-source">${doc.source}</td>
        <td>${linkCell}</td>
      </tr>`;
  }).join('');

  const applyBtns = proc.apply.map(a => {
    if (a.link) {
      return `<a class="apply-btn" href="${a.link}" target="_blank" rel="noopener">↗ ${a.name}</a>`;
    }
    return `<span class="apply-btn no-link-apply">${a.name}</span>`;
  }).join('');

  const tagClass = `tag-${proc.tag}`;

  return `
    <div class="procedure-item" id="proc-${proc.id}">
      <div class="procedure-header" onclick="toggleItem('${proc.id}')">
        <span class="tag ${tagClass}">${proc.tag}</span>
        <span class="procedure-title">${proc.title}</span>
        <span class="chevron">▼</span>
      </div>
      <div class="procedure-detail">
        <p class="detail-desc">${proc.description}</p>

        <div class="section-label">필요 서류</div>
        <table class="doc-table">
          <thead>
            <tr>
              <th>서류명</th>
              <th>발급처</th>
              <th>링크</th>
            </tr>
          </thead>
          <tbody>
            ${docsRows}
          </tbody>
        </table>

        <div class="section-label">신청 / 접수</div>
        <div class="apply-list">
          ${applyBtns}
        </div>

        ${proc.notes ? `<div class="notes-box">${proc.notes}</div>` : ''}
      </div>
    </div>`;
}

function toggleItem(id) {
  const el = document.getElementById(`proc-${id}`);
  el.classList.toggle('open');
}

async function init() {
  const list = document.getElementById('procedure-list');
  if (!list) return;

  const procedures = await loadProcedures();
  list.innerHTML = procedures.map(renderProcedure).join('');

  // URL 해시로 딥링크: 해당 항목 자동 펼침 + 스크롤
  const hash = location.hash.slice(1);
  if (hash) {
    const el = document.getElementById(hash);
    if (el) {
      el.classList.add('open');
      setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    }
  }
}

init();
