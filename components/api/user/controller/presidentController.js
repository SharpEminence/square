var President = require("./../../../../models/President");


module.exports.getPresident = async(req,res)=>{
  


  await President.find({event:req.params.id}).sort({title: 1}).exec(async(err,data) => {
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
          message:"President data",
          data: data
      })
      }
    });
    
}

