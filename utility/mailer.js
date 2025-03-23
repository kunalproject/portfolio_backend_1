import nodemailer from 'nodemailer';
 export const  send_mail=(sender_email,message,subject)=>{
 try{
   const mailTransporter =  nodemailer.createTransport(
        {
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_ID,
                pass: process.env.MAIL_PASSWORD
            }
        }
    );
    const mailDetails = {
        from: process.env.EMAIL_ID,
        to: sender_email ,
        subject: subject,
        html: message
    };
    mailTransporter
    .sendMail(mailDetails,
        function (err, data) {
            if (err) {
                console.log('Error Occurs');
            } else {
                console.log('Email sent successfully');
            }
        });
 }
 catch(err){
     console.log(err);
 }
 }