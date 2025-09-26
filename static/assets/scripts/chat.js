// Configuration Socket.IO
const socket = io()

// Éléments DOM
const form = document.getElementById('chat-form')
const input = document.getElementById('msg')
const messages = document.getElementById('messages')

// Variables globales
let currentUser = null
let currentContact = null

// Initialisation
document.addEventListener('DOMContentLoaded', async () => {
	await loadCurrentUser()
	await loadCurrentContact()
	await loadMessages()
	setupSocketListeners()
	setupFormHandler()
})

// Charger l'utilisateur actuel
async function loadCurrentUser() {
	try {
		const response = await fetch('/api/me', {
			credentials: 'include',
		})

		if (response.ok) {
			const data = await response.json()
			currentUser = data.data
			console.log('Utilisateur connecté:', currentUser)
		} else {
			// Rediriger vers la page de connexion
			window.location.href = 'auth.html'
		}
	} catch (error) {
		console.error("Erreur lors du chargement de l'utilisateur:", error)
		window.location.href = 'auth.html'
	}
}

// Charger le contact actuel depuis l'URL
async function loadCurrentContact() {
	const urlParams = new URLSearchParams(window.location.search)
	const contactParam = urlParams.get('contact')

	if (!contactParam) {
		alert('Aucun contact sélectionné')
		window.location.href = 'contacts.html'
		return
	}

	try {
		const response = await fetch('/api/contacts', {
			credentials: 'include',
		})

		if (response.ok) {
			const data = await response.json()
			currentContact = data.data.find(
				contact =>
					contact.id == contactParam ||
					contact.identifier === contactParam ||
					contact.username === contactParam
			)

			if (!currentContact) {
				alert('Contact introuvable')
				window.location.href = 'contacts.html'
				return
			}

			// Mettre à jour le titre de la page
			document.title = `Echo — Chat with ${currentContact.username}`
		}
	} catch (error) {
		console.error('Erreur lors du chargement du contact:', error)
	}
}

// Charger les messages existants
async function loadMessages() {
	try {
		const response = await fetch('/api/messages', {
			credentials: 'include',
		})

		if (response.ok) {
			const data = await response.json()
			displayMessages(data.data)
		}
	} catch (error) {
		console.error('Erreur lors du chargement des messages:', error)
	}
}

// Afficher les messages
function displayMessages(messagesList) {
	messages.innerHTML = ''

	// Filtrer les messages pour ce contact
	// const contactMessages = messagesList.filter(
	// 	msg => msg.to === currentContact.identifier || msg.from === currentContact.identifier
	// )

	const contactMessages = messagesList

	// Trier par timestamp (plus ancien en premier)
	contactMessages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))

	contactMessages.forEach(message => {
		addMessageToDOM(message)
	})

	// Scroll vers le bas
	messages.scrollTop = messages.scrollHeight
}

// Ajouter un message au DOM
function addMessageToDOM(message) {
	const div = document.createElement('div')
	const isFromMe = message.from === currentUser.identifier

	div.className = `bubble ${isFromMe ? 'sent' : 'received'}`

	// Contenu du message
	const content = document.createElement('div')
	content.textContent = message.content
	div.appendChild(content)

	// Timestamp
	const timestamp = document.createElement('small')
	timestamp.className = 'message-timestamp'
	timestamp.textContent = formatTimestamp(message.timestamp)
	div.appendChild(timestamp)

	// Status (pour les messages envoyés)
	if (isFromMe) {
		const status = document.createElement('span')
		status.className = `message-status ${message.status.toLowerCase()}`
		status.textContent = getStatusText(message.status)
		div.appendChild(status)
	}

	messages.appendChild(div)
}

// Formater le timestamp
function formatTimestamp(timestamp) {
	const date = new Date(timestamp)
	const now = new Date()
	const diff = now - date

	// Si c'est aujourd'hui, afficher l'heure
	if (diff < 24 * 60 * 60 * 1000) {
		return date.toLocaleTimeString('fr-FR', {
			hour: '2-digit',
			minute: '2-digit',
		})
	}

	// Sinon, afficher la date
	return date.toLocaleDateString('fr-FR', {
		day: '2-digit',
		month: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
	})
}

// Obtenir le texte du statut
function getStatusText(status) {
	const statusMap = {
		STORED: '✓',
		DELIVERED: '✓✓',
		READ: '✓✓',
	}
	return statusMap[status] || '?'
}

// Configurer les listeners Socket.IO
function setupSocketListeners() {
	// Écouter les nouveaux messages
	socket.on('messages:append', message => {
		// Vérifier si le message est pour ce contact
		if (message.to === currentContact.identifier || message.from === currentContact.identifier) {
			addMessageToDOM(message)
			messages.scrollTop = messages.scrollHeight
		}
	})

	// Écouter les mises à jour de statut
	socket.on('message:status', data => {
		updateMessageStatus(data.messageId, data.status)
	})
}

// Mettre à jour le statut d'un message
function updateMessageStatus(messageId, newStatus) {
	const messageElements = messages.querySelectorAll('.bubble.sent')
	messageElements.forEach(element => {
		const statusElement = element.querySelector('.message-status')
		if (statusElement) {
			statusElement.textContent = getStatusText(newStatus)
			statusElement.className = `message-status ${newStatus.toLowerCase()}`
		}
	})
}

// Configurer le handler du formulaire
function setupFormHandler() {
	form.addEventListener('submit', async e => {
		e.preventDefault()

		const text = input.value.trim()
		if (!text || !currentContact) return

		// Désactiver le formulaire
		const submitBtn = form.querySelector('button[type="submit"]')
		const originalText = submitBtn.textContent
		submitBtn.disabled = true
		submitBtn.textContent = 'Sending...'

		try {
			const response = await fetch('/api/messages', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					to: currentContact.identifier,
					content: text,
				}),
				credentials: 'include',
			})

			if (response.ok) {
				input.value = ''
				// Le message sera ajouté via Socket.IO
			} else {
				const error = await response.json()
				alert(error.message || "Erreur lors de l'envoi du message")
			}
		} catch (error) {
			console.error('Erreur:', error)
			alert('Erreur de connexion')
		} finally {
			// Réactiver le formulaire
			submitBtn.disabled = false
			submitBtn.textContent = originalText
		}
	})
}

