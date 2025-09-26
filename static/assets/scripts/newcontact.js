async function createContact(formData) {
  try {
    const res = await fetch('/api/contacts', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify(formData),
      credentials: 'include'
    });
    
    const data = await res.json();
    
    if (res.ok && data.status === 200) {
      // Succès - rediriger vers la page des contacts
      window.location.href = 'contacts.html';
    } else {
      // Erreur - afficher le message
      alert(data.message || 'Erreur lors de la création du contact');
    }
  } catch (error) {
    console.error('Erreur:', error);
    alert('Erreur de connexion');
  }
}

function validateForm(formData) {
  const { username, public_key } = formData;
  
  if (!username || username.trim().length < 2) {
    alert('Le nom d\'utilisateur doit contenir au moins 2 caractères');
    return false;
  }
  
  return true;
}

//  Gestion du sélecteur de méthode
function initMethodSelector() {
  const methodBtns = document.querySelectorAll('.method-btn');
  const qrSection = document.getElementById('qr-section');
  const manualSection = document.getElementById('manual-section');
  const publicKeyField = document.getElementById('public-key');

  methodBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const method = btn.dataset.method;
      
      // Mettre à jour les boutons
      methodBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      // Afficher/masquer les sections
      if (method === 'qr') {
        qrSection.classList.remove('hidden');
        manualSection.classList.add('hidden');
        publicKeyField.removeAttribute('required');
      } else {
        qrSection.classList.add('hidden');
        manualSection.classList.remove('hidden');
        // publicKeyField.setAttribute('required', 'required');
      }
    });
  });

  // Gérer le scan QR (pour l'instant, rediriger vers under-construction pour le moment)
  const qrScanBtn = document.querySelector('.qr-scan-btn');
  if (qrScanBtn) {
    qrScanBtn.addEventListener('click', () => {
      window.location.href = 'under-construction.html';
    });
  }
}


function initDropdown() {
  const dropdownToggle = document.getElementById('key-toggle');
  const dropdownContent = document.getElementById('key-dropdown');
  const dropdownContainer = dropdownToggle.closest('.dropdown-container');
  const dropdownText = dropdownToggle.querySelector('.dropdown-text');

  dropdownToggle.addEventListener('click', () => {
    const isOpen = dropdownContent.classList.contains('open');
    
    if (isOpen) {
      // Fermer
      dropdownContent.classList.remove('open');
      dropdownContainer.classList.remove('open');
      dropdownText.textContent = 'Click to add public key';
    } else {
      // Ouvrir
      dropdownContent.classList.add('open');
      dropdownContainer.classList.add('open');
      dropdownText.textContent = 'Public key (click to hide)';
    }
  });

  // Fermer en cliquant à l'extérieur
  document.addEventListener('click', (e) => {
    if (!dropdownContainer.contains(e.target)) {
      dropdownContent.classList.remove('open');
      dropdownContainer.classList.remove('open');
      dropdownText.textContent = 'Click to add public key';
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('new-contact-form');
  
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const formData = new FormData(form);
			const public_key = await formData.get('public_key').text()
      const contactData = {
        username: formData.get('username').trim(),
        public_key
      };
      
      if (validateForm(contactData)) {
        // Désactiver le bouton pendant la soumission
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Adding...';
        
        try {
          await createContact(contactData);
        } finally {
          // Réactiver le bouton
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
        }
      }
    });
  }
  
  // Initialiser les deux fonctionnalités
  initMethodSelector();
  initDropdown();
});