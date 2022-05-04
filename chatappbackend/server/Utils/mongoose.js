'use strict';

const mongoose = require('mongoose');

async function makeMongooseDbConn(){
    await mongoose.connect('mongodb://u7aundau2v938dmuskbe:5adnlFNUNTp01SrHxG78@brlfq6q4hlmiic8-mongodb.services.clever-cloud.com:27017/brlfq6q4hlmiic8');
};

try {
    makeMongooseDbConn();
} catch (error) {
    throw error;
} finally {
    console.log('db connected');
}

module.exports = mongoose