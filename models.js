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
        zillowId: {type:Number,required:true}
    },
    user_notes:{
        offer_price: {type:Number},
        pros: {type:String},
        cons: {type:String},
        nick_name: {type:String}
    }
    
});

//serialize method for dashboard
homeSchema.methods.dashboard_serialize = function(){
    return {
        id: this._id,
        streetAddress: this.address.streetAddress,
        city: this.address.city,
        state: this.address.state,
        zip: this.address.zip,
        //nick_name: this.user_notes.nick_name
    };
}

const Home = mongoose.model('home', homeSchema);

module.exports = {Home};