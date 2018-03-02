'use strict';

const express = require('express');
const morgan = require('morgan');

const app = express();

app.use(express.static('public'));
app.use(morgan('common'));

app.get('/', (req,res) => {
    res.sendFile(__dirname + '/public/index.html');
})

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