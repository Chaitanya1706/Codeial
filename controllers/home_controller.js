const Post = require('../models/post');

module.exports.home = function(req,res){
    // console.log(req.cookies);
    // Post.find({},function(err,posts){
    //     return res.render('home',{
    //         title : 'Codeial | Home',
    //         posts : posts
    //     });
    // })

    
    // populating the user field using its id...so that now user will contain its all details
    Post.find({})
    .populate('user')   // populating user field from post schema
    .populate({   
        path : 'comments',   // populating comments field from post schema
        populate : {    
            path : 'user'   // further populating user field from comments field
        }
    })
    .exec(function(err,posts){
        return res.render('home',{
            title : 'Codeial | Home',
            posts : posts
        });
    });
    
}