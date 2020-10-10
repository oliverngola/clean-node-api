const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '..', '..', '.env') })
const MongoHelper = require('../infra/helpers/mongo-helper')
const { mongoUrl, port } = require('./config/env')

MongoHelper.connect(mongoUrl)
  .then(() => {
    const app = require('./config/app')
    app.listen(port, () => console.log(`SERVER IS RUNNING on http://localhost:${port}/api`))
  }).catch(console.error)
