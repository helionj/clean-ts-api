import { Express } from 'express'
import { bodyParser } from './middleware/boddy-parser'

export default (app: Express): void => {
  app.use(bodyParser)
}
