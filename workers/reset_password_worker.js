const queue = require('../config/kue');

const resetPasswordMailer = require('../mailers/reset_password_mailer');

queue.process('resetPassword', function(job,done){
    console.log('resetPassword worker is processing a job', job.data);

    resetPasswordMailer.resetPassword(job.data);

    done();
});