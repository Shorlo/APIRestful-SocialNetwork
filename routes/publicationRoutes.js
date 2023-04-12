/*  APIRESTFUL-SOCIALNETWORK/publicationRoutes.js
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

const express = require('express');
const router = express.Router();
const multer = require('multer');
const check = require('../middelwares/auth');
const PublicationController = require('../controllers/publicationController');

// Upload multer files
const storage = multer.diskStorage
({
     destination: (request, file, cb) =>
     {
          cb(null, './uploads/publications/');
     },
     filename: (request, file, cb) =>
     {
          cb(null, 'publication-'+Date.now()+'-'+file.originalname);
     }
});
const uploads = multer({storage});

// define routes
router.get('/testPublication', PublicationController.testPublication);
router.post('/savePublication', check.auth, PublicationController.savePublication);
router.get('/getPublicationById/:id', check.auth, PublicationController.getPublicationById);
router.delete('/deletePublicationById/:id', check.auth, PublicationController.deletePublicationById);
router.get('/listPublicationsByIdUser/:id/:page?', check.auth, PublicationController.listPublicationsByIdUser);
router.post('/uploadPublicationImage/:id', [check.auth, uploads.single('filePublication')], PublicationController.uploadPublicationImage);
router.get('/getPublicationImage/:filePublication', check.auth, PublicationController.getPublicationImage);
router.get('/feeds/:page?', check.auth, PublicationController.feeds);

module.exports = router;