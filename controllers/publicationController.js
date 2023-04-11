/*  APIRESTFUL-SOCIALNETWORK/publicationController.js
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

const { response, request } = require('express');
const Publication = require('../models/Publication');
const { param } = require('../routes/followRoutes');

// test actions
const testPublication = (request, response) => 
{
     return response.status(200).send
     ({
          message: 'Message sent from: controllers/publication.js'
     });  
}

// Save publication
const savePublication = (request, response) =>
{
     // Get data from body
     const params = request.body;

     // No data resturn 400
     if(!params.text)
     {
          return response.status(400).send
          ({
               status: 'Error',
               message: 'You must to send publication text.'
          });
     }
     // Create and fill model object
     let newPublication = new Publication(params);
     newPublication.user = request.user.id;

     // Save Object in database
     newPublication.save().then((publicationStored) => 
     {
          if(!publicationStored)
          {
               return response.status(400).send
               ({
                    status: 'Error',
                    message: 'Publication not stored...'
               });
          }
          return response.status(200).send
          ({
               status: 'Success',
               message: 'Publication saved successfuly',
               publicationStored
          });

     }).catch(() =>
     {
          return response.status(500).json
          ({
               status: 'Error',
               message: 'Publication not saved...'
          });
     });
}

// Get a publication
const getPublicationById = (request, response) =>
{
     // Get id of publication url
     const publicationId = request.params.id;

     // Find publication
     Publication.findById(publicationId).then((publicationStored) => 
     {
          if(!publicationStored)
          {
               return response.status(400).send
               ({
                    status: 'Error',
                    message: 'Publication not exists...'
               });
          }

          return response.status(200).send
          ({
               status: 'Success',
               message: 'Get One Publication',
               publication: publicationStored
          });
     }).catch(() =>
     {
          return response.status(500).json
          ({
               status: 'Error',
               message: 'Error finding the publication...'
          });
     });

     
}

// Delete publications

// List all publications

// List a user publication

// Upload files

// Get files


module.exports = 
{
     testPublication,
     savePublication,
     getPublicationById
};