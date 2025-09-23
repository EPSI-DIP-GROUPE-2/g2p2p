import { Express } from 'express'
import helmet from 'helmet'

export const HelmetInterceptor = (app: Express) => {
	app.use(
		helmet({
			contentSecurityPolicy: {
				directives: {
					defaultSrc: ["'self'"],
					scriptSrc: ["'self'", "'unsafe-inline'"],
					styleSrc: ["'self'", "'unsafe-inline'", 'https:'],
					imgSrc: ["'self'", 'data:', 'https:'],
					connectSrc: ["'self'", 'https:'],
					fontSrc: ["'self'", 'https:', 'data:'],
					objectSrc: ["'none'"],
					upgradeInsecureRequests: [],
				},
			},
			referrerPolicy: { policy: 'no-referrer' },
			crossOriginEmbedderPolicy: true,
			crossOriginOpenerPolicy: { policy: 'same-origin' },
			crossOriginResourcePolicy: { policy: 'same-origin' },
			dnsPrefetchControl: { allow: false },
			frameguard: { action: 'deny' },
			hidePoweredBy: true,
			hsts: { maxAge: 63072000, includeSubDomains: true, preload: true },
			ieNoOpen: true,
			noSniff: true,
			permittedCrossDomainPolicies: { permittedPolicies: 'none' },
			xssFilter: true,
		})
	)

	return app
}
