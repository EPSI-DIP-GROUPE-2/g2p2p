import path from 'path'
import express, { Response, Request, Express } from 'express'
import { validateMiddleware, AuthMiddleware } from '@src/middlewares'
import { AuthSchema, ContactSchema, MessageSchema } from '@src/schemas'
import { AuthController, ContactController, MessageController } from '@src/controllers'

export const assignRoutes = (app: Express) => {
	app.get('/health', (_req: Request, res: Response) => res.sendStatus(200))

	app.use(express.static(path.resolve(__dirname, '../static')))

	// Serve index.html on root
	app.get('/', (_req: Request, res: Response) =>
		res.sendFile(path.resolve(__dirname, '../static/index.html'))
	)

	app.get('/home', (_req: Request, res: Response) =>
		res.sendFile(path.resolve(__dirname, '../static/home.html'))
	)
	app.get('/auth', (_req: Request, res: Response) =>
		res.sendFile(path.resolve(__dirname, '../static/auth.html'))
	)
	app.get('/register', (_req: Request, res: Response) =>
		res.sendFile(path.resolve(__dirname, '../static/register.html'))
	)
	app.get('/contacts', (_req: Request, res: Response) =>
		res.sendFile(path.resolve(__dirname, '../static/contacts.html'))
	)
	app.get('/chat', (_req: Request, res: Response) =>
		res.sendFile(path.resolve(__dirname, '../static/chat.html'))
	)
	app.get('/under-construction', (_req: Request, res: Response) =>
		res.sendFile(path.resolve(__dirname, '../static/under-construction.html'))
	)
	app.get('/newcontact', (_req: Request, res: Response) =>
		res.sendFile(path.resolve(__dirname, '../static/newcontact.html'))
	)

	app.get('/chat', (_req: Request, res: Response) =>
		res.sendFile(path.resolve(__dirname, '../static/chat.html'))
	)

	// Auth controllers
	app.post('/api/login', validateMiddleware(AuthSchema.login), AuthController.loginHandler)
	app.get('/api/me', AuthMiddleware.http, AuthController.meHandler)

	// Contacts controllers
	app.get('/api/contacts', AuthMiddleware.http, ContactController.findAllHandler)
	app.post(
		'/api/contacts',
		AuthMiddleware.http,
		validateMiddleware(ContactSchema.create),
		ContactController.createHandler
	)

	// Messages controllers
	app.post(
		'/api/messages',
		AuthMiddleware.http,
		validateMiddleware(MessageSchema.create),
		MessageController.createHandler
	)

	app.post('/api/messages/receive', MessageController.receiveHandler)

	app.get('/api/messages', AuthMiddleware.http, MessageController.listHandler)
}
