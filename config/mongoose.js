const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://Chats:wkTnlxjfJG9dmxTP@cluster0.mxmxr.mongodb.net/codeial_development?retryWrites=true&w=majority');

const db = mongoose.connection;

db.on('error',console.error.bind(console,'Error in connecting to DB!!'));

db.once('open',function(){
    console.log('Connect to Database :: MongoDB');
})

module.exports = db;