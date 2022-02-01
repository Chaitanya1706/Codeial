const nodeMailer = require('../config/nodemailer');

exports.resetPassword = (token) => {
    console.log('Inside reset Mailer', token);

    let htmlString = nodeMailer.renderTemplate({token : token}, '/passwords/reset_password.ejs');
    nodeMailer.transporter.sendMail({
        from: '17agrawalchaitanya@gmail.com',
        to : token.user.email,
        subject : 'Reset Password',
        html : htmlString
    }, (err,info) => {
        if(err){
            console.log('Error in sending mail', err);
            return;
        }

        console.log('Reset Password Mail Sent**', info);
    })
}