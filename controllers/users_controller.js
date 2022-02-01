const User = require('../models/user')
const ResetTokens = require('../models/resetTokens');
const crypto = require('crypto');

const queue = require('../config/kue');
const resetPasswordWorker = require('../workers/reset_password_worker');

const fs = require('fs');
const { promisify } = require('util')
const unlinkAsync = promisify(fs.unlink)

const path = require('path');

module.exports.profile = function(req,res){

    User.findById(req.params.id, function(err,user){
        return res.render('user_profile',{
            title : 'User Profile',
            profile_user : user
        });
    });

    
}

module.exports.update = async function(req,res){
    if(req.user.id==req.params.id){

        try{
            const user = await User.findById(req.params.id);

            User.uploadedAvatar(req,res,function(err){
                if(err){
                    console.log('*****Multer Error',err);
                    return;
                }

                user.name = req.body.name;
                user.email = req.body.email;
                if(req.file){

                    if(user.avatar){
                        unlinkAsync(path.join(__dirname+'..'+user.avatar));
                    }

                    // this is saving the path of uploaded file into user avatar field
                    user.avatar = User.avatarPath + '/' + req.file.filename;
                }

                user.save();
                return res.redirect('back');

            });
        }catch(err){
            console.log('Error!!',err);
            return res.redirect('back');
        }

        
    }else{
        req.flash('error','Unauthorized!')
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
        req.flash('error', 'Passwords do not match');
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


module.exports.forgotPassword = function(req,res){
    return res.render('forgotPassword',{
        title : 'Forgot Password'
    })
}

module.exports.resetPassword = async function(req,res){
    try{
        const user = await User.findOne({email : req.body.email});

        if(!user){
            req.flash('error','User not Found!!');
            return redirect('back');
        }
        else{
            let token = await ResetTokens.create({
                user : user,
                accessToken : crypto.randomBytes(20).toString('hex'),
                isValid : true
            })

            token = await token.populate('user');
            console.log(token);
            let job = queue.create('resetPassword',token).save(function(err){
                if(err){
                    console.log('Error in sending to the queue',err);
                    return;
                }
                console.log('job enqueued', job.id);
            })

            req.flash('success','Reset Password Link Sent to your email!');
            return res.redirect('back');
        }
    }catch(err){
        console.log(err);
        return;
    }
    
    
}

module.exports.setPassword = async function(req,res){
    // console.log(req.query.token);
    let t = req.query.token;
    const token = await ResetTokens.findOne({"acessToken":t.trim()});
    console.log("Token****",token);
    
    if(!token.isValid){
        return res.send('<h1>Link Expired</h1>');
    }
    return res.render('setPassword',{
        title : 'Set Password',
        token : token
    })
}

module.exports.changePassword = async function(req,res){

    if(req.body.newPassword !== req.body.confirmPassword){
        req.flash('error','Paswword mot matched!!');
        return res.redirect('back');
    }
    try{
        const token = await ResetTokens.findById(req.query.token);
        const user = await User.findById(token.user);
        token.isValid = false;
        user.password = req.body.newPassword;
        req.flash('success','Password succesfully Changed!!');
        user.save();

        return res.redirect('/user/signin')
    }catch(err){
        console.log(err);
        return;
    }
    

}
