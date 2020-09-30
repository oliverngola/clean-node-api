const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '..', '..', '.env') })
const MongoHelper = require('../infra/helpers/mongo-helper')
const env = require('./config/env')

MongoHelper.connect(env.mongoUrl)
  .then(() => {
    const app = require('./config/app')
    app.listen(5858, () => console.log('SERVER IS RUNNING'))
  }).catch(console.error)
