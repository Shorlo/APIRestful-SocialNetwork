/*  APIRESTFUL-SOCIALNETWORK/followController.js
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

const Follow = require('../models/Follow');
const User = require('../models/User');

// test actions
const testFollow = (request, response) => 
{
     return response.status(200).send
     ({
          message: 'Message sent from: controllers/follow.js'
     });  
}

// saveFollow
const saveFollow = (request, response) =>
{
     // Get data from body
     const params = request.body;

     // Get user followd id
     const followedIdentity = request.user;

     // Create object with model follow
     let userToFollow = new Follow
     ({
          user: followedIdentity.id,
          following: params.following
     });
     // Save object in database
     userToFollow.save().then((followStored) =>
     {
          if(!followStored)
          {
               return response.status(404).send
               ({
                    status: 'Error',
                    message: 'No follow to storage'
               });
          }
          return response.status(200).send
          ({
               status: 'Success',
               identity: request.user,
               follow: followStored
          });
     }).catch(() =>
     {
          return response.status(500).send
               ({
                    status: 'Error',
                    message: 'No follow to storage'
               });
     });

}
// Delete follow

// List follow users

// List folowers



module.exports = { testFollow, saveFollow };