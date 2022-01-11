const Post = require('../models/post');

module.exports.viewPost = function(req,res){
    res.end('<h1>Showing the Posts!!</h1>')
}

module.exports.createPost = function(req,res){

    Post.create({
        content : req.body.content,
        user : req.user._id
    },function(err,post){
        if(err){
            console.log('Error in Creating Post', err);
            return;
        }
        return res.redirect('/')
    })
}