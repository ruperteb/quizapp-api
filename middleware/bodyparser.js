const bodyParser = require('body-parser')
exports.jsonParser = bodyParser.json()

// create application/x-www-form-urlencoded parser
exports.urlencodedParser = bodyParser.urlencoded({ extended: false })