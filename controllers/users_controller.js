const User = require('../models/user')

module.exports.profile = function(req,res){
    res.render('user_profile',{
        title : 'Profile'
    });
}


module.exports.signup = function(req,res){
    return res.render('signup',{
        title : 'sign-up'
    })
}

module.exports.signin = function(req,res){
    // console.log("logged in");
    return res.render('signin',{
        title :'sign-in'
    })
}

module.exports.create = function(req,res){
    console.log(req.body);
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

module.exports.createSession = function(req,res){
    return res.render()
}
