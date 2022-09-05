export default {
  mongoUrl: process.env.MONGO_URL || 'mongodb://docker:mongopw@localhost:55000/clean-node-api?authSource=admin',
  port: process.env.PORT || 5050,
  jwtSecret: process.env.JWT_SECRET || '$%675849H&*'
}
