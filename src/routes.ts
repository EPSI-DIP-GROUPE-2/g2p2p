import path from 'path'
import express, { Response, Request, Express } from 'express'

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
}
