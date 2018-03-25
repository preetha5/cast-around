'use strict';

const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const path = require("path");

//User Authentication Includes
const passport = require('passport');
const { Router: usersRouter} = require('./users');
const { Router: authRouter, localStrategy, jwtStrategy } = require('./auth');

//Call routers
const searchRouter = require('./searchRouter');
const homeDetailsRouter = require('./homeDetailsRouter');
const dashboardRouter = require('./dashboardRouter');
//Import config data
const {DATABASE_URL, PORT} = require('./config');
//import the model for home
const {Home} = require('./models');

const app = express();

//User Authentication-Router
passport.use(localStrategy);
passport.use(jwtStrategy);
const jwtAuth = passport.authenticate('jwt', {session:false});

app.use('/signup', usersRouter);
app.use('/login', authRouter);


//Middleware and routers
app.use(express.static('public'));
app.use(morgan('common'));

// CORS
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
  if (req.method === 'OPTIONS') {
    return res.send(204);
  }
  next();
});


// Routers for endpoints
//Get the search request from client and pass it to zillow API router
app.use('/user/search',[jwtAuth, jsonParser], searchRouter );


//Get the save to DB request from search page and pass it to home Details router
app.use('/user/home_details',jwtAuth, homeDetailsRouter);

//Get request to the dashboard will list all user-saved homes
app.use('/user/dashboard',jwtAuth, dashboardRouter );

/* BEGIN ENDPOINTS */
app.get('/', (req,res) => {
    res.sendFile(__dirname + '/public/index.html');
});

let server;

// this function connects to our database, then starts the server
function runServer(databaseUrl = DATABASE_URL, port = PORT) {
    return new Promise((resolve, reject) => {
      console.log('starting runserver..');
      mongoose.connect(databaseUrl, err => {
        if (err) {
          return reject(err);
        }
        server = app.listen(port, () => {
          console.log(`Your app is listening on port ${port}`);
          resolve();
        })
          .on('error', err => {
            mongoose.disconnect();
            reject(err);
          });
      });
    });
  }

// this function closes the server, and returns a promise. we'll
// use it in our integration tests later.
function closeServer() {
    return mongoose.disconnect().then(() => {
      return new Promise((resolve, reject) => {
        console.log('Closing server');
        server.close(err => {
          if (err) {
            return reject(err);
          }
          resolve();
        });
      });
    });
  }

if(require.main === module){
    runServer(DATABASE_URL).catch(err => console.error(err));
};

module.exports = {app, runServer, closeServer};