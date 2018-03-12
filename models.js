'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const homeSchema = mongoose.Schema({
    address: {
        street: {type:String,required:true},
        city: {type:String,required:true},
        state: {type:String,required:true},
        zip: {type:String,required:true},
    },
    user_notes: {
        offer_price: Number,
        pros : String,
        cons : String,
        nick_name: String
    },
    zillowId: Number
});

//serialize method for dashboard
homeSchema.methods.dashboard_serialize = function(){
    return {
        id: this._id,
        street: this.address.street,
        city: this.address.city,
        state: this.address.state,
        zip: this.address.zip,
        nick_name: this.user_notes.nick_name
    };
}

const HOME = mongoose.model('home', homeSchema);

module.exports = {HOME};