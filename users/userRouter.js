'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const {User} = require('./models');
const Router = express.Router();
const jsonParser = bodyParser.json();

//Post endpoint to register the new user
Router.post('/', jsonParser, (req, res) => {
 const requiredFields = ['username' , 'password'];
 const missingFields = requiredFields.find(field => !(field in req.body));

 if (missingFields){
     return res.status(422).json({
        code: 422,
        reason: 'Validation Error',
        message: 'Missing field',
        location: missingFields
     })
 }
console.log(req.body);
 //Check that input values are of type 'String'
 const inputStrings = ["username", "password", "firstName", "lastName"];
 const nonStrings = inputStrings.find(input => input in req.body 
    && typeof req.body[input] !== 'string');

if (nonStrings){
    return res.status(422).json({
        code:422,
        reason: 'Validation Error',
        message:"Invalid input type. Expected :String",
        location: nonStrings
    });
}

//Check to make sure there's no whitespace in username/password fields
const expectedTrimmedFields = ['username', 'password'];
const nonTrimmedFields = expectedTrimmedFields.find(
    field => req.body[field].trim() !== req.body[field]
);
if (nonTrimmedFields){
    return res.status(422).json({
        code:422,
        reason: 'Validation Error',
        message:"Cannot have beginning/trailing whitespaces",
        location: nonTrimmedFields
    });
}

//Check that username and password are within mon, max length
const sizedFields = {
    username: {
      min: 1
    },
    password: {
      min: 8,
      // bcrypt truncates after 72 characters, so let's not give the illusion
      // of security by storing extra (unused) info
      max: 72
    }
  };
  const tooSmallField = Object.keys(sizedFields).find(
    field =>
      'min' in sizedFields[field] &&
            req.body[field].trim().length < sizedFields[field].min
  );
  const tooLargeField = Object.keys(sizedFields).find(
    field =>
      'max' in sizedFields[field] &&
            req.body[field].trim().length > sizedFields[field].max
  );

  if (tooSmallField || tooLargeField) {
    return res.status(422).json({
      code: 422,
      reason: 'Validation Error',
      message: tooSmallField
        ? `Must be at least ${sizedFields[tooSmallField]
          .min} characters long`
        : `Must be at most ${sizedFields[tooLargeField]
          .max} characters long`,
      location: tooSmallField || tooLargeField
    });
  }

  let {username, password, firstName = '', lastName = ''} = req.body;
  // Trim the firstName and lastName
  firstName = firstName.trim();
  lastName = lastName.trim();

  return User.find({username})
    .count()
    .then(count =>{
        if (count >0){
            console.info("count is", count);
            return res.status(422).json({
                code: 422,
                reason: 'Validation Error',
                message: 'Username already taken',
                location: 'username'
              });
        }
        //User does not exist so has password
        return User.hashPassword(password);
    })
    .then(hash =>{
        return User.create({
            username,
            password:hash,
            firstName,
            lastName
        })
    .then(user => {
        return res.status(201).json(user.serialize());
        })
    .catch(err =>{
        if (err.reason === 'Validation Error') {
            return res.status(err.code).json(err);
          }
          res.status(500).json({code: 500, message: 'Internal server error'});
        });
    });

});// End POST to users end point

module.exports = {Router};