'use strict';

const mongoose = require('mongoose');

async function makeMongooseDbConn(){
    await mongoose.connect('mongodb://localhost:27017');
};

try {
    makeMongooseDbConn();
} catch (error) {
    throw error;
} finally {
    console.log('db connected');
}

module.exports = mongoose