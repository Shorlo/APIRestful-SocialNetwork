const jwt = require('jwt-simple');
const moment = require('moment');

// Secret key
const secret = 'SECRET_KEY_OF_SOCIAL_NETWORK_PROJECT_92749cjrowe6836girwe721';

// Create function to generate tokens
const createToken = (user) =>
{
    const payload = 
    {
        id: user._id,
        name: user.name,
        surname: user.surname,
        nick: user.nick,
        email: user.email,
        role: user.role,
        image: user.image,
        iat: moment().unix(),
        exp: moment().add(30, 'days').unix
    };
    // Return jwt encode token
    return jwt.encode(payload, secret);
}
module.exports = {createToken};