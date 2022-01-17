const User = require('../models/user')

module.exports.profile = function(req,res){

    User.findById(req.params.id, function(err,user){
        return res.render('user_profile',{
            title : 'User Profile',
            profile_user : user
        });
    });

    
}

module.exports.update = function(req,res){
    if(req.user.id==req.params.id){
        User.findByIdAndUpdate(req.params.id, req.body,function(err,user){
            return res.redirect('back');
        });
    }else{
        return res.status(401).send('Unauthorized');
    }
}


module.exports.signup = function(req,res){
    
    if(req.isAuthenticated()){
        // console.log(req.user)
        return res.redirect(`/user/profile/${req.user.id}`);
    }

    return res.render('signup',{
        title : 'sign-up'
    })
}

module.exports.signin = function(req,res){
    // console.log("logged in");
    if(req.isAuthenticated()){
        return res.redirect(`/user/profile/${req.user.id}`);
    }
    return res.render('signin',{
        title :'sign-in'
    })
}

module.exports.create = async function(req,res){
    // console.log(req.body);
    if(req.body.password != req.body.confirm_password){
        return res.redirect('back');
    }

    try{
        const user = await User.findOne({email:req.body.email})

        if(!user){
            await User.create(req.body)
            return res.redirect('/user/signin');
        }else{

            return res.redirect('back');
        }
    }catch(err){
        console.log('Error!!',err);
    }
    
    
}

// sign in and create a session for the user
module.exports.createSession = function(req,res){
    req.flash('success','Logged In Successfully!')
    return res.redirect('/');
}

module.exports.destroySession = function(req,res){
    req.logout();
    req.flash('success','You have Logged Out!')
    res.redirect('/');
}
