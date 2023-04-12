/*  APIRESTFUL-SOCIALNETWORK/validate.js
       ____     __           _           _____        __
      / __/_ __/ /  ___ ____(_)__  ___  / ___/__  ___/ /__
 ___ _\ \/ // / _ \/ -_) __/ / _ `/ _ \/ /__/ _ \/ _  / -_)_____________________
|   /___/\_, /_.__/\__/_/ /_/\_,_/_//_/\___/\___/\_,_/\__/                      |
| Shorlo/___/                                                                   |
|                                                                               |
|   Copyright © 2023 Javier Sainz de Baranda Goñi.                              |
|   Released under the terms of the GNU Lesser General Public License v3.       |
|                                                                               |
|   This program is free software: you can redistribute it and/or modify it     |
|   under the terms of the GNU General Public License as published by the Free  |
|   Software Foundation, either version 3 of the License, or (at your option)   |
|   any later version.                                                          |
|   This program is distributed in the hope that it will be useful, but         |
|   WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY  |
|   or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License     |
|   for more details.                                                           |
|                                                                               |
|   You should have received a copy of the GNU General Public License along     |
|   with this program. If not, see <http://www.gnu.org/licenses/>.              |
|                                                                               |
'==============================================================================*/

const validator = require('validator');

const validate = (params) =>
{
    let name =  validator.isEmpty(params.name) && 
                validator.isLength(params.name, {min: 3, max: undefined}) &&
                validator.isAlpha(params.name, 'es-ES');

    let surname =   !validator.isEmpty(params.surname) && 
                    validator.isLength(params.surname, {min: 3, max: undefined}) &&
                    validator.isAlpha(params.surname, 'es-ES');

    let nick =  !validator.isEmpty(params.nick) && 
                validator.isLength(params.nick, {min: 2, max: undefined});

    let email = !validator.isEmpty(params.email) && 
                validator.isEmail(params.email);

    let password =  !validator.isEmpty(params.password);

    if(params.bio)
    {
        let bio =   validator.isLength(params.bio, {min: undefined, max: 255});
        if(!bio)
        {
            throw new Error('Validation failed');
        }
        else
        {
            console.log('Validation succesfuly');
        }
    }
    

    if(!name || !surname || !nick || !email || !password)
    {
        throw new Error('Validation failed');
    }
    else
    {
        console.log('Validation succesfuly');
    }
}

module.exports = validate;