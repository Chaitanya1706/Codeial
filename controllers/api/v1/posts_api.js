const Post = require('../../../models/post');
const Comment = require('../../../models/comment');

module.exports.index = async function(req,res){
    let posts = await Post.find({})
        .sort('-createdAt')   // sort according to latest created time
        .populate('user')   // populating user field from post schema
        .populate({   
            path : 'comments',   // populating comments field from post schema
            populate : {    
                path : 'user'   // further populating user field from comments field
            }
        })
    return res.json(200, {
        message: "List of Posts",
        posts: posts
    })
}


module.exports.destroy = async function(req, res){

    try{
        let post = await Post.findById(req.params.id);

        if (post.user == req.user.id){
            post.remove();

            await Comment.deleteMany({post: req.params.id});

            return res.json(200, {
                message: "Post and its comments deleted!!"
            });
        }else{
            return res.json(401, {
                message: "You are not allowed to delete this post!!"
            })
        }

    }catch(err){
        return res.json(500, {
            message: "Internal Server Error"
        });
    }
    
}