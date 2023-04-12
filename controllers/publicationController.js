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
const fs = require('fs');
const path = require('path');
const Publication = require('../models/Publication');


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
               return response.status(404).send
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
const deletePublicationById = (request, response) =>
{
     // Get id of publication url
     const publicationId = request.params.id;

     // Find publication in database
     Publication.findOneAndDelete({'user': request.user.id, '_id': publicationId}).then((publicationDeleted) =>
     {
          if(!publicationDeleted)
          {
               return response.status(404).send
               ({
                    status: 'Error',
                    message: 'Publication to delete not found...'
               });
          }
          return response.status(200).send
          ({
               status: 'Success',
               message: 'Publication was deleted succesfuly',
               publication: publicationId,
               publicationDeleted: publicationDeleted
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

// List user publications
const listPublicationsByIdUser = (request, response) =>
{
     // Get userId
     const userId = request.params.id;
     
     // Page control
     let page = 1;
     if(request.params.page)
     {
          page = request.params.page;
     }
     
     // Find, populate, order by new publication and pagination
     const itemsPerPage = 5;
     Publication.find({'user': userId}).sort('-create_at').populate('user', '-password -__v -role').paginate(page, itemsPerPage).then(async(publications) =>
     {
          const totalPublications = await Publication.countDocuments({}).exec();

          if(!publications || publications.length <= 0)
          {
               return response.status(404).send
               ({
                    status: 'Error',
                    message: 'No publications found...'
               });
          }
          return response.status(200).send
          ({
               status: 'Success',
               message: 'List Publication by User', 
               page: page,
               pages: Math.ceil(totalPublications/itemsPerPage), 
               totalPublications: totalPublications,
               publications,
          });
     }).catch(() => 
     {
          return response.status(500).json
          ({
               status: 'Error',
               message: 'Error listing publications...'
          });
     });
}

// Upload publication image
const uploadPublicationImage = (request, response) =>
{
     // Get publication id
     const publicationId = request.params.id;

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
          Publication.findOneAndUpdate({user: request.user.id, _id: publicationId}, {file: request.file.filename}, {new: true}).then((publicationUpdated) =>
          {
               if(!publicationUpdated)
               {
                    return response.status(404).send
                    ({
                         status: 'Error',
                         message: 'Publication to update is empty...'
                    });
               }
               return response.status(200).send
               ({
                    status: 'Success',
                    publication: publicationUpdated,
                    file: request.file,
               });
          }).catch(() =>
          {
               return response.status(500).send
               ({
                    status: 'Error',
                    message: 'Error finding publication to update...'
               });
          });
     }
}

// Get publication image
const getPublicationImage = (request, response) => 
{
     // Get url params for the image
     const filePublication = request.params.filePublication;

     // Build the path of real image
     const filePath = './uploads/publications/'+filePublication;

     // Check image exists
     fs.stat(filePath, (error, exists) =>
     {
          if(error)
          {
               return response.status(500).send
               ({
                    status: 'Error',
                    message: 'Error checking publication image...'
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

// List all publications


module.exports = 
{
     testPublication,
     savePublication,
     getPublicationById,
     deletePublicationById,
     listPublicationsByIdUser,
     uploadPublicationImage,
     getPublicationImage
};