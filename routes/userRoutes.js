/*  APIRESTFUL-SOCIALNETWORK/userRoutes.js
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
const multer= require('multer');
const UserController = require('../controllers/userController');
const check = require('../middelwares/auth');

// Upload multer files
const storage = multer.diskStorage
({
     destination: (request, file, cb) =>
     {
          cb(null, './uploads/avatars/');
     },
     filename: (request, file, cb) =>
     {
          cb(null, 'avatar-'+Date.now()+'-'+file.originalname);
     }
});
const uploads = multer({storage});

// define routes
router.get('/testUser', check.auth, UserController.testUser);
router.post('/registerUser', UserController.registerUser);
router.post('/loginUser', UserController.loginUser);
router.get('/getUser/:id', check.auth, UserController.getUser);
router.get('/listUserPerPage/:page?', check.auth, UserController.listUserPerPage);
router.put('/updateUser', check.auth, UserController.updateUser);
router.post('/uploadImage', [check.auth, uploads.single('fileAvatar')], UserController.uploadImage);


module.exports = router;