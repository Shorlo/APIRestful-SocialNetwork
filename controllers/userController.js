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
const fs = require('fs');
const path = require('path');
const User = require('../models/User');
const jwt = require('../services/jwt');
const mongoosePagination = require('mongoose-pagination');
const followService = require('../services/followService');
const Follow = require('../models/Follow');
const Publication = require('../models/Publication');
const validate = require('../helpers/validate');

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
          return response.status(404).json
          ({
               status: 'Error',
               message: 'Missing data...',
          });
     }

     // Advance validation
     try
     {
          validate(params);
     }
     catch(error)
     {
          return response.status(400).json
          ({
               status: 'Error',
               message: 'Validation failed'
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
                    return response.status(404).json
                    ({
                         status: 'Error',
                         message: 'User to stored is not exist...'
                    });
               }
               const userCreated = userStored.toObject();
               delete userCreated.password;
               delete userCreated.role;

               return response.status(200).json
               ({
                    status: 'Success',
                    message: 'User stored successfuly!',
                    user: userCreated
               });
          }).catch(() =>
          {
               return response.status(500).json
               ({
                    status: 'Error',
                    message: 'User was not saved...'
               });
          });
     }).catch(() =>
     {
          return response.status(500).json
          ({
               status: 'Error',
               message: 'User not found...'
          });
     });
}

const loginUser = (request, response) =>
{
     // Get params
     let params = request.body;
     if(!params.email || !params.password)
     {
          return response.status(404).send
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
               return response.status(404).send
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
     }).catch(() =>
     {
          return response.status(500).send
               ({
                    status: 'Error',
                    message: 'Login error',
               });
     });
}

const getUser = (request, response) =>
{
     // Get idUser by url
     const idUser = request.params.id;

     // Query to get user from database
     User.findById(idUser).select({password: 0, role: 0, email: 0 }).then(async (user) =>
     {
          if(!user)
          {
               return response.status(404).send
               ({
                    status: 'Error',
                    message: 'User not found...'
               });
          }

          // Get follow info
          const followInfo = await followService.followThisUser(request.user.id, idUser);

          return response.status(200).send
          ({
               status: 'Success',
               user: user,
               following: followInfo.following,
               follower: followInfo.follower
          });
     }).catch(() =>
     {
          return response.status(500).send
          ({
              status: 'Error',
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
     let itemsPerPage = 5;

     //User.find().select({password: 0, role: 0, email: 0, __v: 0}).sort('_id').paginate(page, itemsPerPage).then(async (users) =>
     User.find().select('-password -role -email -__v').sort('_id').paginate(page, itemsPerPage).then(async (users) =>
     {
          // Get total users
          const totalUsers = await User.countDocuments({}).exec();
          if(!users || users.length <= 0)
          {
               return response.status(404).send
               ({
                    status: 'Error',
                    message: "No users avaliable..."

               });
          }

          // Get follow info
          let followUserIds = await followService.followUserIds(request.user.id);

          // Return response
          return response.status(200).send
          ({
               status: 'Success',
               users,
               page,
               itemsPerPage,
               total: totalUsers,
               pages: Math.ceil(totalUsers/itemsPerPage),
               usersFollowing: followUserIds.following,
               userFollowingMe: followUserIds.followers
          });
     }).catch(() =>
     {
          return response.status(500).send
          ({
               status: 'Error',
               message: 'Query error...'

          });
     });
}

const updateUser = (request, response) =>
{
     // Get user info to update
     let userIdentity = request.user;
     let userToUpdate = request.body;

     // Delete fields that we don't need
     delete userToUpdate.iat;
     delete userToUpdate.exp;
     delete userToUpdate.role;
     delete userToUpdate.image;

     User.find
     ({
          $or:
          [
               {email: userToUpdate.email.toLowerCase()},
               {nick: userToUpdate.nick.toLowerCase()}
          ]
     }).then(async (users) =>
     {
          let userIsset = false;

          users.forEach(user =>
          {
               if(user && user._id != userIdentity.id)
               {
                    userIsset = true;
               }
          });
          if(userIsset)
          {
               return response.status(200).send
               ({
                    status: 'Success',
                    message: 'The user already exists'
               });
          }

          // Encode password
          if(userToUpdate.password)
          {
               let pwd = await bcrypt.hash(userToUpdate.password, 10);
               userToUpdate.password = pwd;
          }
          else
          {
               delete userToUpdate.password;
          }

          User.findByIdAndUpdate({_id: userIdentity.id}, userToUpdate, {new: true}).then((userUpdated)=>
          {
               if(!userUpdated)
               {
                    return response.status(404).json
                    ({
                        status: 'Error',
                        message: "Error updating user"
                    });
               }
               return response.status(200).send
               ({
                    status: 'Success',
                    message: 'User updated',
                    user: userUpdated
               });
          }).catch(() =>
          {
               return response.status(500).json
               ({
                    status: 'Error',
                    message: "Error finding user to update"
               });
          });
     }).catch(() =>
     {
          return response.status(500).json
          ({
               status: 'Error',
               message: "User not found..."
          });
     });
}

const uploadImage = (request, response) =>
{
     // Get image file and check exists
     if(!request.file)
     {
          return response.status(404).send
          ({
               status: 'Error',
               message: 'Request without image file...',

          });
     }

     // Get file name
     const imageFile = request.file.originalname;

     // Get extension file
     const extensionFile = imageFile.split('.')[1];

     // If file is not image delete
     if(extensionFile != 'png' && extensionFile != 'jpeg' && extensionFile != 'jpg' && extensionFile != 'gif' && extensionFile != 'PNG' && extensionFile != 'JPEG' && extensionFile != 'JPG' && extensionFile != 'GIF')
     {
          // Delete file and return response.
          fs.unlinkSync(request.file.path);
          return response.status(400).json
          ({
               status: 'Error',
               message: 'File extension invalid...',
          });
     }
     else
     {
          // Save image in database
          User.findOneAndUpdate({_id: request.user.id}, {image: request.file.filename}, {new: true}).then((userUpdated) =>
          {
               if(!userUpdated)
               {
                    return response.status(404).send
                    ({
                         status: 'Error',
                         message: 'User to update is empty...'
                    });
               }
               return response.status(200).send
               ({
                    status: 'Success',
                    user: userUpdated,
                    file: request.file,
               });
          }).catch(() =>
          {
               return response.status(500).send
               ({
                    status: 'Error',
                    message: 'Error finding user to update...'
               });
          });
     }
}

const getAvatar = (request, response) =>
{
     // Get url params for the image
     const fileAvatar = request.params.fileAvatar;

     // Build the path of real image
     const filePath = './uploads/avatars/'+fileAvatar;

     // Check image exists
     fs.stat(filePath, (error, exists) =>
     {
          if(error)
          {
               return response.status(500).send
               ({
                    status: 'Error',
                    message: 'Error checking image...'
               });
          }
          if(!exists)
          {
               return response.status(404).send
               ({
                    status: 'Error',
                    message: 'File is not exists...'
               });
          }

          // Return file
          return response.sendFile(path.resolve(filePath)); // <-- ABSOLUTE PATH require('path')
     });
}

const counters = async (request, response) =>
{
     let userId = request.user.id;

     if(request.params.id)
     {
          userId = request.params.id;
     }

     try
     {
          const following = await Follow.count({'user': userId});
          const followed = await Follow.count({'followed': userId});
          const publications = await Publication.count({'user': userId});
          return response.status(200).send
          ({
               status: 'Success',
               userId,
               following: following,
               followed: followed,
               publications: publications
          });
     }
     catch(error)
     {
          return response.status(500).send
          ({
               status: 'Error',
               message: 'Error getting counters...',
               error
          });
     }
}

module.exports =
{
     testUser,
     registerUser,
     loginUser,
     getUser,
     listUserPerPage,
     updateUser,
     uploadImage,
     getAvatar,
     counters
};
