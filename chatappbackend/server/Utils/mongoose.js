'use strict';

const mongoose = require('mongoose');

async function makeMongooseDbConn(){
    await mongoose.connect('mongodb://127.0.0.1:27017/reactchatapp');
};

try {
    makeMongooseDbConn();
} catch (error) {
    throw error;
} finally {
    console.log('db connected');
}

module.exports = mongoose