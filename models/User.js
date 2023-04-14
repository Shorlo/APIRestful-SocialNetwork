/*  APIRESTFUL-SOCIALNETWORK/User.js
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

const {Schema, model} = require('mongoose');

const UserSchema = Schema
({
    name:
    {
        type: String,
        require: true
    },
    surname: String,
    bio: String,
    nick:
    {
        type: String,
        require: true
    },
    email:
    {
        type:String,
        require: true
    },
    password:
    {
        type: String,
        require: true,
        select: false
    },
    role:
    {
        type: String,
        default: 'role_user',
        select: false
    },
    image:
    {
        type: String,
        default: 'default.png'
    },
    create_at:
    {
        type: Date,
        default: Date.now
    }
});

module.exports = model('User', UserSchema, 'users'); //'MODEL_NAME, MODEL_SCHEMA, COLLECTION_MODEL_DATABASE
