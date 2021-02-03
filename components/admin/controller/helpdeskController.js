
const timestamp = require('time-stamp');
created_date = timestamp.utc('YYYY-MM-DD HH:mm:ss');

const getHelp = async(req,res)=>{
  let active = 'help';
        let title =  'Help Desk';
  return  res.render('helpdesk/desk',{active,title});
}

// const postMessage = async(req,res)=>{

//   if(!req.body) {
//     return res.status(400).send({
//         message: "Note content can not be empty"
//     });
//     }
//     var user_data = await User.find({email:req.body.email}).exec();
//      if(user_data.length>0)
//      {
//        return res.json({
//            status: 400,
//            message: 'Email already exit!'
//        });
//      }
//      else{
//     // Create a User
//     const Threads = new Thread({
//             created_at:created_date,
//             updated_at:created_date
//     });
//     // Save User in the database
//    await Threads.save()
//     .then(async data => {
//        let thread_id = Threads._id
//       // console.log(user_id);
//         var thread_participant = await ThreadParticipant.register({thread_id:thread_id,sender_id:req.body.sender_id, receiver_id:req.body.receiver_id,created_at:created_date,updated_at:created_date});

//         var messages = await Message.register({thread_id:thread_id,sender_id:req.body.sender_id, receiver_id:req.body.receiver_id,created_at:created_date,updated_at:created_date});
        
        
//       // return {data,...resolvedFinalArray}
//        return res.send({ 
//            status: 200,
//            data:messages,
//            message: 'User added successfully'});
//     }).catch(err => {
//            return res.send({ status: 500,
//            message: 'Something went wrong!'});
//     })

//    }
// }


module.exports ={
  getHelp,
  // postMessage
}
