export default {
  /* mongoUrl: process.env.MONGO_URL || 'mongodb://docker:mongopw@mongo:55000/clean-node-api?authSource=admin', */
  mongoUrl: process.env.MONGO_URL || 'mongodb://mongo:27017/clean-node-api?authSource=admin',
  port: process.env.PORT || 5050,
  jwtSecret: process.env.JWT_SECRET || '$%675849H&*'
}
