'use strict';

const initialItems = [
  { id: 1, title: 'JavaScript for starters', tag: 'Frontend', text: 'Variables, functions, DOM and events. First interactive website.' },
  { id: 2, title: 'Python: programing basics', tag: 'Backend', text: 'Data types, cycles, functions and work with files.' },
  { id: 3, title: 'Data base and SQL', tag: 'Data', text: 'Tables, requests SELECT, connections.' },
  { id: 4, title: 'Git and GitHub', tag: 'Tools', text: 'Commits, branches, pull requests and teamwork.' },
];
const LOAD_DELAY_MS = 1800;

let items = [...initialItems];
let loadTimer = null;
let currentState = 'loading';

const stateBlocks = document.querySelectorAll('[data-state]');
const switchButtons = document.querySelectorAll('[data-set-state]');
const list = document.getElementById('list');
const template = document.getElementById('card-template');
const filterInput = document.getElementById('filter');
const emptyText = document.getElementById('empty-text');
const emptyAction = document.getElementById('empty-action');

function renderState(stateName) {
  currentState = stateName;
  stateBlocks.forEach((block) => {
    block.classList.toggle('is-hidden', block.dataset.state !== stateName);
  });
  switchButtons.forEach((btn) => {
    btn.setAttribute('aria-pressed', String(btn.dataset.setState === stateName));
  });
}

function renderList() {
  const query = filterInput.value.trim();
  const visible = items.filter((item) => item.title.toLowerCase().includes(query.toLowerCase()));

  list.replaceChildren();

  if (visible.length === 0) {
    emptyText.textContent = query
      ? `За запитом «${query}» курсів немає. Скиньте фільтр, щоб побачити весь список.`
      : 'У каталозі не залишилось жодного курсу. Відновіть початковий список.';
    renderState('empty');
    return;
  }

  visible.forEach((item) => {
    const card = template.content.cloneNode(true);
    card.querySelector('.card__title').textContent = item.title;
    card.querySelector('.card__tag').textContent = item.tag;
    card.querySelector('.card__text').textContent = item.text;
    card.querySelector('.card__delete').dataset.id = item.id;
    list.append(card);
  });
  renderState('content');
}

function loadData() {
  window.clearTimeout(loadTimer);
  renderState('loading');
  loadTimer = window.setTimeout(() => {
    items = [...initialItems];
    renderList();
  }, LOAD_DELAY_MS);
}

function resetData() {
  items = [...initialItems];
  filterInput.value = '';
  renderList();
}

document.querySelector('.switcher').addEventListener('click', (event) => {
  const btn = event.target.closest('[data-set-state]');
  if (!btn) return;
  const name = btn.dataset.setState;
  window.clearTimeout(loadTimer);

  if (name === 'content') {
    resetData();
  } else if (name === 'empty') {
    items = [];
    filterInput.value = '';
    renderList();
  } else {
    renderState(name);
  }
});

document.getElementById('refresh').addEventListener('click', loadData);
document.getElementById('retry').addEventListener('click', loadData);
emptyAction.addEventListener('click', resetData);

filterInput.addEventListener('input', () => {
  if (currentState === 'content' || currentState === 'empty') renderList();
});

list.addEventListener('click', (event) => {
  const btn = event.target.closest('.card__delete');
  if (!btn) return;
  items = items.filter((item) => item.id !== Number(btn.dataset.id));
  renderList();
});

loadData();
