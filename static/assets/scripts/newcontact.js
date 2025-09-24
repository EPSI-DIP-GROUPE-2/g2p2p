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
  
  if (!public_key || public_key.trim().length < 10) {
    alert('La clé publique semble invalide');
    return false;
  }
  
  return true;
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('new-contact-form');
  
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const formData = new FormData(form);
      const contactData = {
        username: formData.get('username').trim(),
        public_key: formData.get('public_key').trim()
        // Pas d'identifier - il est auto-généré côté serveur
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
  
  // Afficher un aperçu de l'identifiant qui sera généré
  const publicKeyField = document.getElementById('public-key');
  const identifierField = document.getElementById('identifier');
  
  if (publicKeyField && identifierField) {
    publicKeyField.addEventListener('input', () => {
      const publicKey = publicKeyField.value.trim();
      if (publicKey) {
        // Générer un aperçu de l'identifiant (même logique que le serveur)
        const hash = btoa(publicKey).substring(0, 16);
        identifierField.placeholder = `Auto-generated: ${hash}`;
        identifierField.value = ''; // Vider le champ car il sera généré côté serveur
      }
    });
  }
});