const Comment = require('../models/comment');
const Post = require('../models/post');

module.exports.create = async function(req,res){
    // console.log(req.body);
    // console.log(req.user);
    const post = await Post.findById(req.body.post);
    try{
        if(post){
            
            const comment = await Comment.create({
                content : req.body.content,
                post : req.body.post,
                user : req.user._id
            })
            post.comments.push(comment);
            post.save();
            req.flash('success','Comment Created!!');
            return res.redirect('/');
        }
        else{
            req.flash('error','You are not signed in!!');
            return res.redirect('/user/signin')
        }
    }catch(err){
        req.flash('error',err);
        return res.redirect('back')    
    }
    
}

module.exports.destroy = async function(req,res){

    try{
        const comment = await Comment.findById(req.params.id)

        if(comment.user == req.user.id){
            let postId = comment.post;

            comment.remove();

            await Post.findByIdAndUpdate(postId, {$pull : {comments : req.params.id}})
            req.flash('success','Comment deleted!!');
            return res.redirect('back');

        }else{
            req.flash('error','You cannot delete this comment!')
            return res.redirect('back');
        }
    }catch(err){
        req.flash('error',err);
        return res.redirect('back')   
    }
}