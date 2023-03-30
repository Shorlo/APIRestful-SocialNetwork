/*  APIRESTFUL-SOCIALNETWORK/userController.js
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

const bcrypt = require('bcrypt');
const { response } = require('express');
const User = require('../models/User');
const jwt = require('../services/jwt');
const mongoosePagination = require('mongoose-pagination');

// Test actions
const testUser = (request, response) => 
{
     return response.status(200).send
     ({
          message: 'Message sent from: controllers/user.js',
          user: request.user
     });  
}

// Register users
const registerUser = (request, response) =>
{
     // Get data
     let params = request.body;
     
     // Check data validator
     if(!params.name || !params.nick || !params.email || !params.password)
     {
          return response.status(400).json
          ({
               status: "Error",
               message: 'Missing data...',
               params
          });
     }
      

     User.find
     ({
          $or: 
          [
               {email: params.email.toLowerCase()},
               {nick: params.nick.toLowerCase()}
          ]
     }).then(async (user) =>
     {
          if(user && user.length >= 1)
          {
               return response.status(200).json
               ({
                    status: 'Success',
                    message: 'The user exists...'
               });
          }
          // Encode password
          let pwd = await bcrypt.hash(params.password, 10);
          params.password = pwd;

          // Check duplicates
          
          let userToSave = new User(params);
          // Save user in database and return response
          userToSave.save().then((userStored) =>
          {
               if(!userStored)
               {
                    return response.status(500).json
                    ({
                         status: 'Error',
                         error: error,
                         message: 'User to stored is not exist...'
                    });
               }
               return response.status(200).json
               ({
                    status: 'Success',
                    message: 'User stored successfuly!',
                    user: userStored
               });
          }).catch((error) =>
          {
               return response.status(500).json
               ({
                    status: 'Error',
                    error: error,
                    message: 'User was not saved...'
               });
          });
     }).catch((error) =>
     {
          return response.status(500).json
          ({
               status: "Error",
               error: error,
               message: "User not found..."
          });
     });
}

const loginUser = (request, response) =>
{
     // Get params
     let params = request.body;
     if(!params.email || !params.password)
     {
          return response.status(400).send
          ({
               status: 'Error',
               message: 'Missing data to send'
          });
     }
     
     // Search in database if exists
                                      //.select({'password': 0})       
     User.findOne({email: params.email}).then((user) =>
     {
          if(!user)
          {
               return response.status(404).send
               ({
                    status: 'Error',
                    message: 'User does not exist'
               });
          }

          // Check password
          const pwd = bcrypt.compareSync(params.password, user.password);
          if(!pwd)
          {
               return response.status(400).send
               ({
                    status: 'Error',
                    message: 'Password incorrect...'
               });
          }
          
          // Get token
          const token = jwt.createToken(user);

          // Return user data
          return response.status(200).send
          ({
               status: 'Success',
               message: 'Login successfully',
               user: 
               {
                    id: user._id,
                    name: user.name,
                    nick: user.nick
               },
               token
          });
     }).catch((error) => 
     {
          return response.status(404).send
               ({
                    status: 'Error',
                    message: 'Login error',
                    error: error
               });
     });
}

const getUser = (request, response) =>
{
     // Get idUser by url
     const idUser = request.params.id;

     // Query to get user from database
     User.findById(idUser).select({password: 0, role: 0 }).then((user) =>
     {
          if(!user)
          {
               return response.status(404).send
               ({
                    status: "Error",
                    message: "User not found..."
               });
          }
          // Return response

          // Next -> get follows info

          return response.status(200).send
          ({
               status: 'Success',
               user: user
          });
     }).catch((error) =>
     {
          return response.status(404).send
          ({
              status: "Error",
              error: error,
              message: "Error getting user data..."
          });
     });
}

const listUserPerPage = (request, response) =>
{
     // Check current page
     let page = 1;
     if(request.params.page)
     {
          page = parseInt(request.params.page);
     }
     
     // Query mongoose pagination
     let itemsPerPage = 1;
     
     User.find().sort('_id').paginate(page, itemsPerPage).then(async (users) =>
     {
          // Get total users
          const totalUsers = await User.countDocuments({}).exec();
          if(!users)
          {
               return response.status(404).send
               ({
                    status: "Error",
                    error: error,
                    message: "No users avaliable..."
                    
               });
          }

          // Return response
          return response.status(200).send
          ({
               status: 'Success',
               users,
               page,
               itemsPerPage,
               total: totalUsers,
               pages: false
          });

     }).catch((error) =>
     {
          return response.status(500).send
          ({
               status: "Error",
               error: error,
               message: "Query error..."
               
          });
     });
}

module.exports = { testUser, registerUser, loginUser, getUser, listUserPerPage };