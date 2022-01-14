const Post = require('../models/post');
const User = require('../models/user');

module.exports.home = function(req,res){
    // console.log(req.cookies);
    // Post.find({},function(err,posts){
    //     return res.render('home',{
    //         title : 'Codeial | Home',
    //         posts : posts
    //     });
    // })

    
    // finding post and then populating different fields
    Post.find({})
    .populate('user')   // populating user field from post schema
    .populate({   
        path : 'comments',   // populating comments field from post schema
        populate : {    
            path : 'user'   // further populating user field from comments field
        }
    })
    .exec(function(err,posts){

        User.find({},function(err,users){
            return res.render('home',{
                title : 'Codeial | Home',
                posts : posts,
                all_users : users
            });
        });
        
    });
    
}