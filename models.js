'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const homeSchema = mongoose.Schema({
    address: {
        streetAddress: {type:String,required:true},
        city: {type:String,required:true},
        state: {type:String,required:true},
        zip: {type:String,required:true},
    },
    home_details: {
        property_type: {type:String},
        beds: {type:String},
        baths : {type:String},
        year_built : {type:String},
        area: {type:String},
        zillowId: {type:Number, required:true, unique: true }
    },
    user_notes:{
        offer: {type:Number, default:0},
        pros: {type:String, default:''},
        cons: {type:String, default:''},
        nickName: {type:String, default:''}
    }
    
});

//serialize method for sending data to client
homeSchema.methods.dashboard_serialize = function(){
    return {
        id: this._id,
        streetAddress: this.address.streetAddress,
        city: this.address.city,
        state: this.address.state,
        zip: this.address.zip,
        zillowId: this.home_details.zillowId,
        nick_name: this.user_notes.nick_name
    };
}

const Home = mongoose.model('home', homeSchema);

module.exports = {Home};