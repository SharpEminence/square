var nodemailer = require('nodemailer');


module.exports.sendMailer = (data)=>{
    console.log("yop0-=",data)
    // create reusable transporter object using the default SMTP transport
    // var transporter = nodemailer.createTransport('smtps://shivam.version@123gmail.com:version@123@smtp.gmail.com');
var transporter = nodemailer.createTransport(
{
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // use TLS
    auth: {
        user:'test.dev788@gmail.com',
        pass:'admin@1234'
    },
    tls: {
        //do not fail on invalid certs
        rejectUnauthorized: false
      }
    });

// setup e-mail data with unicode symbols
var mailOptions =  {
    from: 'test.dev788@gmail.com', //sender address
    to: data.email, //list of receivers
    subject: data.subject, // Subject line
    text:'', // plaintext body
    html: data.body // html body
};
console.log("jkjk",mailOptions)
// send mail with defined transport object
transporter.sendMail(mailOptions, function(error, info){
    if(error){
        return console.log("error===",error);
    }
    //console.log('Message sent: ' + info.response);
    console.log('Message sent: ' + info.messageId);
});


}