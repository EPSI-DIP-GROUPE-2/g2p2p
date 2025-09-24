import path from 'path'
import express, { Response, Request, Express } from 'express'
import { validateMiddleware } from '@src/middlewares'
import { AuthSchema, MessageSchema } from '@src/schemas'
import { AuthController, ContactController, MessageController } from '@src/controllers'
import authMiddleware from './middlewares/auth.middleware'

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

	// Auth controllers
	app.post('/api/login', validateMiddleware(AuthSchema.login), AuthController.loginHandler)
	app.get('/api/me', authMiddleware, AuthController.meHandler)

	// Contacts controllers
	app.get('/api/contacts', authMiddleware, ContactController.findAllHandler)

	// Messages controllers
	app.post(
		'/api/messages',
		authMiddleware,
		validateMiddleware(MessageSchema.create),
		MessageController.createHandler
	)
}
