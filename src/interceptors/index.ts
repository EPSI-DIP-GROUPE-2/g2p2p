import { Express } from 'express'

import { MorganInterceptor } from './morgan.interceptor'
import { HelmetInterceptor } from './helmet.interceptor'

export const Interceptors: ((app: Express) => Express)[] = [
	MorganInterceptor,
	HelmetInterceptor,
] as const
