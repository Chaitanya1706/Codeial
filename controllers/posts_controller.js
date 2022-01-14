const Post = require('../models/post');
const Comment = require('../models/comment');

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

module.exports.destroy = function(req,res){
    Post.findById(req.params.id,function(err,post){
        if(post.user == req.user.id){
            post.remove();

            Comment.deleteMany({post:req.params.id},function(err){
                return res.redirect('back');
            });
        }else{
            return res.redirect('back');
        }
        
    })
}