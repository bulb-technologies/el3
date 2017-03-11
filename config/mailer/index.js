(function(){

    var nodemailer = require('nodemailer');
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'itunesonny@gmail.com',
            pass: 'Dragon922'
        }
    });

    module.exports = transporter;

})();
