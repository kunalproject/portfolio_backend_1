
import Portfolio from '../model/portfolio.model.js';
import { send_mail } from '../utility/mailer.js';
export const send_data=async (req,res)=>{
    console.log("send  _data")
try{
    const username = req.params.username;
    const user= await Portfolio.findOne({username:username});
    if(!user){
        return res.status(404).json({error:"Portfolio not found"})
    } 
    console.log("user",user)
  try{
      const user_data =req.body;
      console.log("user_data",user_data)
        const {mail}=req.body
    // mail to user acknowledging the message
    const message=`
    <p>Dear ${user_data.name || 'User'},</p>
    <p>Thank you for reaching out to me through my portfolio website.</p>
    <p>I have received your message and will get back to you as soon as possible.</p>
    <p><strong>Your Message:</strong></p>
    <blockquote>${user_data.msg}</blockquote>
    <p>Looking forward to connecting with you!</p>
    ${user.name ? `<p>Best Regards,<br>${user.name}</p>` : 'Best Regards'}
`
    const subject="Acknowledgement of message";
    send_mail(mail,message,subject);
const currentDate = new Date();
const offset = 5.5 * 60 * 60 * 1000; // 5 hours 30 minutes
const newDate = new Date(currentDate.getTime() + offset);

// Format date
const formattedDate = newDate.toLocaleDateString('en-GB', {
  day: 'numeric',
  month: 'long',
  year: 'numeric'
});

// Format time
const formattedTime = newDate.toLocaleTimeString('en-US', {
  hour: 'numeric',
  minute: '2-digit',
  hour12: true
});

const finalOutput = `${formattedDate}, ${formattedTime}`;

    // mail to admin
const admin_message = `
    <h1> Dear ${user.name || "User"}  </h1>
    <p><strong>You have received a message from:</strong> mail: ${mail} name: ${user_data.name}</p>
    <p><strong>Message:</strong> ${user_data.msg}</p>
    <p><strong>Sent on:</strong> ${finalOutput}</p>
`;
    const admin_subject="New message from portfolio website";
    send_mail(user.email,admin_message,admin_subject);
    // save message to database
    await Portfolio.updateOne({username:username}, { $push: { messages: {name:user_data.name,mail:mail,msg:user_data.msg} } });
    res.json({message:"Message sent successfully!"})
  }
  catch(err){
      res.status(500).json({"error":err})
  }
}
catch(err){
    res.status(500).json({"error":err})
}

}
