const Post = require('../models/post');
const User = require('../models/user');

module.exports.home = async function(req,res){

    // console.log(req.cookies);
    // Post.find({},function(err,posts){
    //     return res.render('home',{
    //         title : 'Codeial | Home',
    //         posts : posts
    //     });
    // })


    try{
        // finding post and then populating different fields
        let posts = await Post.find({})
        .populate('user')   // populating user field from post schema
        .populate({   
            path : 'comments',   // populating comments field from post schema
            populate : {    
                path : 'user'   // further populating user field from comments field
            }
        })
        
        let users = await User.find({});
        
        return res.render('home',{
            title : 'Codeial | Home',
            posts : posts,
            all_users : users
        });

    }catch(err){
        console.log('Error',err);
        return;
    }
    
}