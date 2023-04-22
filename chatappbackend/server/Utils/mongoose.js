'use strict';

const mongoose = require('mongoose');

async function makeMongooseDbConn(){
    await mongoose.connect(`${process.env.DB_URL_STRING}`);
};

try {
    makeMongooseDbConn();
} catch (error) {
    throw error;
} finally {
    console.log('db connected');
}

module.exports = mongoose