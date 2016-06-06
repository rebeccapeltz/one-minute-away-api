'use strict';

const express = require('express');
const app = express();
const mongoose = require('mongoose');
// const bodyParser = require('body-parser').json();
const morgan = require('morgan');
const errorHandler = require('./lib/error-handler');

const dbUrl = process.env.MONGODB_URI || 'mongodb://localhost/dev_db';

mongoose.connect(dbUrl);

const userRoutes = require('./route/user-routes');


app.use(morgan('dev'));
app.use('/', userRoutes);

app.use(errorHandler);

app.use((req, res) => {
  res.status(404).json({message: 'not found'});
});


app.listen(process.env.PORT || 3000, () => {
  console.log('up on 3000');
});