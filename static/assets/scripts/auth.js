async function login(username, password) {
  const res = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
    credentials: 'include'
  });
  const data = await res.json();
  if (res.ok && data.status === 200) {
    window.location.href = 'home.html';
  } else {
    alert(data.message || 'Erreur de connexion');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
      login(username, password);
    });
  }
});