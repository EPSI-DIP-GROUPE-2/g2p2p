import path from 'path'
import express, { Response, Request, Express } from 'express'
import { validateMiddleware } from '@src/middlewares'
import { AuthSchema } from '@src/schemas'
import { AuthController } from '@src/controllers'

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
	app.post('/login', validateMiddleware(AuthSchema.login), AuthController.loginHandler)
}
