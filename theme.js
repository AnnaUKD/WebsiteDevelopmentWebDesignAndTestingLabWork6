'use strict';

const themeToggle = document.getElementById('theme-toggle');

function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  themeToggle.textContent = theme === 'dark' ? 'Dark Theme' : 'Light Theme';
  try { localStorage.setItem('theme', theme); } catch {}
}

let savedTheme = null;
try { savedTheme = localStorage.getItem('theme'); } catch {}
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

setTheme(savedTheme || (prefersDark ? 'dark' : 'light'));
themeToggle.addEventListener('click', () => {
  setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
});
