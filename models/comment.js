const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    content :{
        type : String,
        required : true
    },
    // this comment belongs to this user
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    // this comment belong to this post
    post : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Post' 
    }
    
},{
    timestamps  :true
})

const Comment = mongoose.model('Comment',commentSchema);

module.exports = Comment;

