import express from 'express'
import setUpMiddleweres from './middlewares'

const app = express()
setUpMiddleweres(app)
export default app
