'use strict';

const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
//const {house_info} = require('./zillow');

//Call routers
const zillowRouter = require('./zillowRouter');

const app = express();

app.use(express.static('public'));
app.use(morgan('common'));

//Import config data
const {DATABASE_URL, PORT} = require('./config');
//import the model for home
const {HOME} = require('./models');

/* BEGIN ENDPOINTS */
app.get('/', (req,res) => {
    res.sendFile(__dirname + '/public/index.html');
});


//Get the search request from client and pass it to zillow API router
app.use('/user/search',jsonParser, zillowRouter );

//End points for the dashboard page to get list of saved homes by user
app.get('/user/dashboard', (req,res) => {
    HOME
        .find()
        .then(homes=>{
            res.json({
                homes: homes.map(
                    (home) => home.dashboard_serialize())
            });
        })
        .catch(
            err=> {
                console.error(err);
                res.status(500).json({message: 'Internal server error'});
            });
    }); //Get endpoint for dashboard page
    

app.get('/user/home_details/:id', (req,res) => {
      res.sendFile(__dirname + '/public/home_details.html');
});

/* END : ENDPOINTS */

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