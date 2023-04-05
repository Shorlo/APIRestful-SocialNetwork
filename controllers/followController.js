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

const { response } = require('express');
const Follow = require('../models/Follow');
const User = require('../models/User');
const mongoosePagination = require('mongoose-pagination');

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
          followed: params.followed
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
const unfollow = (request, response) =>
{
     // Get id identify user
     const userId = request.user.id;
     
     // Get id of user to unfollow
     const followedId = request.params.id;

     // Find coincidences and remove
     Follow.findOneAndDelete({ user: userId, followed: followedId }).then((followDeleted) =>
     { 
          if(!followDeleted)
          {
               return response.status(404).send
               ({
                    status: 'Error',
                    message: 'Followed not found...'
               });
          }
          return response.status(200).send
          ({
               status: 'Success',
               message: 'Follow deleted successfuly',

          });
     }).catch(() =>
     {
          return response.status(500).send
          ({
               status: 'Error',
               message: 'Error removing followed'
          });
     }); 
}
// List follow users
const listFollowing = (request, response) =>
{
     // Get current user id
     let userId = request.user.id;

     // Check if there is a id by params url
     if(request.params.id)
     {
         userId = request.params.id; 
     }

     //check if there is a page by params url
     let page = 1;

     if(request.params.page)
     {
          page = request.params.page;
     }

     // Users per page to show
     const itemsPerPage = 5;

     // Find data in database
     Follow.find({user: userId}).populate('user followed').then((follows)=> 
     {
          return response.status(200).send
          ({
               status: 'Success',
               message: 'List of following',
               follows
          });
     }).catch(() =>
     {
          return response.status(500).send
          ({
               status: 'Error',
               message: 'Error getting list of following...',
          });
     });


     
}

// List folowers
const listFollowers = (request, response) =>
{
     return response.status(200).send
     ({
          status: 'Success',
          message: 'List of followers'

     });
}

module.exports = { testFollow, saveFollow, unfollow, listFollowing, listFollowers };