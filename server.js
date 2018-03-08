'use strict';

const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const {house_info} = require('./zillow');

const app = express();

app.use(express.static('public'));
app.use(morgan('common'));

app.get('/', (req,res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/user/search', (req,res) => {
    console.log("the house details are ",house_info);
    res.sendFile(__dirname + '/public/search.html');
});

app.post('/user/search', jsonParser, (req,res) => {
    console.log("request to post is " , req);
});

app.get('/user/dashboard', (req,res) => {
    res.sendFile(__dirname + '/public/dashboard.html');
});

app.get('/user/home_details/:id', (req,res) => {
    res.sendFile(__dirname + '/public/home_details.html');
});


let server;

function runServer(){
    const port = process.env.PORT||8080;
    return new Promise((resolve, reject) => {
        app.listen(process.env.PORT||8080, () =>{
            console.log(`Your app is listening on port $(process.env.PORT || 8080)`);
            resolve();
        })
        .on('error', err => {
            reject(err);
        });
    });
}

function closeServer(){
    return new Promise ((resolve, reject) =>{
        console.info("Closing server");
        server.close( err =>{
            if (err){
                reject(err);
                return;
            }
            resolve();
        })
    })
}

if(require.main === module){
    runServer().catch(err => console.error(err));
};

module.exports = {app, runServer, closeServer};