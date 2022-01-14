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
        return res.redirect('/user/profile');
    }

    return res.render('signup',{
        title : 'sign-up'
    })
}

module.exports.signin = function(req,res){
    // console.log("logged in");
    if(req.isAuthenticated()){
        return res.redirect('/user/profile');
    }
    return res.render('signin',{
        title :'sign-in'
    })
}

module.exports.create = function(req,res){
    // console.log(req.body);
    if(req.body.password != req.body.confirm_password){
        return res.redirect('back');
    }

    User.findOne({email:req.body.email},function(err,user){
        if(err){console.log('error in finding user', err); return;}

        if(!user){
            User.create(req.body,function(err,newUser){
                if(err){
                    console.log('Error in creating a User!', err);
                    return;
                }
                return res.redirect('/user/signin');
            })
        }else{

            return res.redirect('back');
        }
    })
    
}

// sign in and create a session for the user
module.exports.createSession = function(req,res){
    return res.redirect('/');
}

module.exports.destroySession = function(req,res){
    req.logout();
    res.redirect('/');
}
