var Demand = require("./../../../../models/Demand");


module.exports.getDemand = async(req,res)=>{
  


  await Demand.find({event:req.params.id}).exec(async(err,data) => {
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
          message:"On Demand data",
          data: data
      })
      }
    });
    
}

