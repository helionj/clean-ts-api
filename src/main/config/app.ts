import express from 'express'
import setUpMiddleweres from './middlewares'
import setUpRoutes from './routes'
const app = express()
setUpMiddleweres(app)
setUpRoutes(app)
export default app
