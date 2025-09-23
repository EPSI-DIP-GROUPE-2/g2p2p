import { Response, Request, Express } from 'express'

export const assignRoutes = (app: Express) => {
	app.get('/health', (_req: Request, res: Response) => res.sendStatus(200))
}
