/*  APIRESTFUL-SOCIALNETWORK/index.js
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

const { connection } = require('./database/connection');
const express = require('express');
const cors = require('cors');
const UserRoutes = require('./routes/userRoutes');
const PublicationRoutes = require('./routes/publicationRoutes');
const FollowRoutes = require('./routes/followRoutes');
// welcome message
console.log('Loading ApiRestful SocialNetwork');
// database connection
connection();

// cretate node server
const app = express();
const PORT = 3900;

// config cors
app.use(cors());

// convert body data to js objects
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// load route config
app.use('/api/user', UserRoutes);
app.use('/api/publication', PublicationRoutes);
app.use('/api/follow', FollowRoutes);

// put server to listen http request
app.listen(PORT, () =>
{
    console.log(`Server running at Port: ${PORT}`);
});