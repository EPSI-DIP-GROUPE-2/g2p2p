async function fetchContacts() {
  const res = await fetch('/api/contacts', { credentials: 'include' });
  if (!res.ok) {
    window.location.href = 'auth.html';
    return;
  }
  const data = await res.json();
  if (data.status !== 200 || !Array.isArray(data.data)) return;

  const list = document.querySelector('.contact-list');
  if (!list) return;
  list.innerHTML = '';
  data.data.forEach(contact => {
    const li = document.createElement('li');
    li.innerHTML = `
      <a class="contact-item" href="chat.html?contact=${encodeURIComponent(contact.username)}">
        <span class="contact-avatar">
          <img src="/assets/logo/logo.svg" alt="${contact.username[0].toUpperCase()}" width="36" height="36">
        </span>
        <span class="contact-info">
          <span class="contact-name">${contact.username}</span><br>
          <span class="contact-lastmsg">Last message preview…</span>
        </span>
      </a>
    `;
    list.appendChild(li);
  });
}

document.addEventListener('DOMContentLoaded', fetchContacts);