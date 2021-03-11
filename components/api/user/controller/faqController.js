var Faq = require("./../../../../models/Faq");


module.exports.getFaqs = async(req,res)=>{
  


  await Faq.find({event_id:req.params.id}).exec(async(err,Faq_data) => {
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
          message:"Faq data",
          data: Faq_data
      })
      }
    });
    
}

