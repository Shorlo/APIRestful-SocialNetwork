const jwt = require('jwt-simple');
const moment = require('moment');


// Import secret key
const libjwt = require('../services/jwt');
const secret = libjwt.secret;

// Authentification MIDDLEWARE
exports.auth = (request, response, next) =>
{
    // Check if header contain auth
    if(!request.headers.authorization)
    {
        return response.status(403).send
        ({
            status: 'Error',
            message: 'Header without Authentification...'
        });
    }
    // Clean token
    let token = request.headers.authorization.replace(/['"]/g, '');

    // Uncode token
    try
    {
        let payload = jwt.decode(token, secret);
        // Check token expiration
        if(payload.exp <= moment().unix())
        {
            return response.status(401).send
            ({
                status: 'Error',
                message: 'Expired token...',
            });
        }
        // Add data to user request
        request.user = payload;
    }
    catch(error)
    {
        return response.status(404).send
        ({
            status: 'Error',
            message: 'Invalid token...',
            error
        });
    }
    
    

    // Next action
    next();
}
