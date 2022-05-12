const { auth } = require('express-oauth2-jwt-bearer');

exports.checkJwt = auth({
    audience: 'https://testexpress/api',
    issuerBaseURL: `https://expresstest.eu.auth0.com/`,
});