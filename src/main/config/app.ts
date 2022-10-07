import express from 'express'
import setUpMiddleweres from './middlewares'
import setUpRoutes from './routes'
import setupSwagger from './config-swagger'

const app = express()
setupSwagger(app)
setUpMiddleweres(app)
setUpRoutes(app)
export default app
