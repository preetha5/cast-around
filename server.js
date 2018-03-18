'use strict';

const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const path = require("path");

//Call routers
const searchRouter = require('./searchRouter');
const homeDetailsRouter = require('./homeDetailsRouter');

const app = express();

app.use(express.static('public'));
app.use(morgan('common'));

//Import config data
const {DATABASE_URL, PORT} = require('./config');
//import the model for home
const {Home} = require('./models');

//Setting up the templating engine : handlebars
var expressHbs = require('express-handlebars');
app.set('views', path.join(__dirname, 'views'))
app.engine('hbs',expressHbs({extname:'hbs', defaultLayout:'main.handlebars', layoutsDir: __dirname + '/views/layouts'}));
app.set('view engine','hbs');

/* BEGIN ENDPOINTS */
app.get('/', (req,res) => {
    res.sendFile(__dirname + '/public/index.html');
});


//Get the search request from client and pass it to zillow API router
app.use('/user/search',jsonParser, searchRouter );

//Get the save to DB request from search page and pass it to home Details router
app.use('/user/home_details', homeDetailsRouter);

//Endpoint api to save data to MongoDB
// app.post('/user/home_details', (req,res) =>{
//   console.log("in server JS");
// })

//End points for the dashboard page to get list of saved homes by user
app.get('/user/dashboard', (req,res) => {
    Home
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
    
//Delete the record when DELETE request comes with zid in the path
app.delete('/user/dashboard/:zid', (req, res) =>{
  console.log("inside delete endpoint", req.params.zid);
  Home
    .findOne({"home_details.zillowId" : req.params.zid})
    .remove()
    .then(() =>{
      console.log(`Deleted home record with ZID ${req.params.zid}`);
      res.status(204).end();
    })
    .catch(
      err=> {
        console.error(err);
        res.status(500).json({message: 'Internal server error'});
    });
})

// app.get('/user/home_details/:id', (req,res) => {
//       res.sendFile(__dirname + '/public/home_details.html');
// });

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