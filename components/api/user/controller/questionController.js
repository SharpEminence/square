var Question = require("./../../../../models/Question");


module.exports.getQuestion = async(req,res)=>{
  


  await Question.find({event_id:req.params.id}).exec(async(err,question_data) => {
      if(err){
        console.log(err);
        return res.json({
          err: err,
          status: 500,
          message:"Something went wrong!",
      })
      }
      else{
        return res.json({
          status: 200,
          message:"Questions data",
          data: question_data
      })
      }
    });
    
}

