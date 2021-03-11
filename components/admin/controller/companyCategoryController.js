var CompanyCategory = require("../../../models/CompanyCategory");
const timestamp = require('time-stamp');
created_date = timestamp.utc('YYYY-MM-DD HH:mm:ss');
const { validationResult } = require ('express-validator');
var moment = require('moment');

module.exports.addBooth = (req,res)=>{
   
    if(typeof req.flash('data')=='undefined')
    {
        var data = {
            booth:'',
            points:'',
        };
        req.flash("data",data);
    }
    
    let active = 'Booth';
    let title = 'Add Booth';
     res.render('booth_category/add_booth',{active,title,data: req.flash('data'),errors:req.flash('errors'),reset:req.flash("reset")});
}

module.exports.addBoothPost = (req,res)=>{

    var data = {name:req.body.name};
    ///////////// Validate request//////////////////////////
    const errors = validationResult(req);
     
    let errorsData = {
        name:'',
                };
    if (errors.array().length > 0)
    { 
        errors.array().forEach((value)  => 
    {
        errorsData[value.param] = value.msg;    
    });

        req.flash("errors",errorsData); 
        req.flash("data",data); 
        return res.redirect('/add-booth');
     }
    ////////////////////////////////////////////////////////////
    if(!req.body) {
        return res.status(400).send({
        message: "Note content can not be empty"
     });
    }


   
$where = {name:req.body.name

};
CompanyCategory.findOne($where,function(err, user) 
    {
       if(user)
       {
        $message = {message:'Booth already exist!'};
            req.flash('errors', $message);   
            req.flash("data",data); 
            return res.redirect('/add-booth');
       
       }
       else{
            // Create a User
    const categories = new CompanyCategory({
        name:req.body.name,
        deck1:req.body.deck1,
        deck2:req.body.deck2,
        demo:req.body.demo,
        points:req.body.points,
        google_meet:req.body.google_meet,
        description:req.body.description,
       created_at:created_date,
       updated_at:created_date
    });

            // Save User in the database
            categories.save()
            .then(data => {
                $message = {msg:'Booth saved successfully!'};
                req.flash('errors', $message);    
                return res.redirect('/add-booth');
            }).catch(err => {
                $message = {message:'Some error occurred!'};
                req.flash('errors', $message);  
                return res.redirect('/add-booth');
            
            })
        }
    });
 

}
   

module.exports.getBooth = (req,res)=>{
    CompanyCategory.find(function(err, userObj){ 
        if(err){
          $message ={message:'Something went wrong'}
        req.flash("errors",$message)
        return res.redirect('/booth-list');
        } 
        else{
          let data = userObj;
          let active = 'Booth';
          let title =  'Booth List';
             return  res.render('booth_category/booth_list',{active,title,data,moment , errors:req.flash("errors"), message:req.flash("message")});
         
        }
      });
 
    
}


module.exports.editBooth = (req,res)=>
{
    let id= req.params.id;
    CompanyCategory.findOne({_id:id},function(err, user)
    { 
       if(err)
       {
          $message ={message:'Something went wrong'}
          req.flash("errors",$message)
          return res.redirect('/edit-booth/'+id);
       } 
       else
       {
          
          let data = user; 
          //data.profile_img = process.env.IMAGE_URL+user.profile_img;
         // console.log(data);
         let active = 'Booth';
          let title =  'Edit Booth';
         res.render('booth_category/edit_booth',{active,title,errors:req.flash("errors"),data});
        }
    });
}


module.exports.updateCategory = (req,res)=>{
  
  let id = req.params.id;
  ///////////// Validate request//////////////////////////
  const errors = validationResult(req);
 
  let errorsData = {
    category:''
  };
  if (errors.array().length > 0)
  { 
    errors.array().forEach((value)  => 
    {
      errorsData[value.param] = value.msg;    
    });

    req.flash("errors",errorsData); 
    return res.redirect('/edit-booth/'+id);
 }
////////////////////////////////////////////////////////////
    if(!req.body) {
        return res.status(400).send({
        message: "Note content can not be empty"
    });
    }

    var where = { name:req.body.name,
        google_meet:req.body.google_meet,
        deck2:req.body.deck2,
        deck1:req.body.deck1,
        demo:req.body.demo,
        points:req.body.points,
        description:req.body.description};
    CompanyCategory.findByIdAndUpdate({ _id: id },where,{new: true}, function(err, result) {
    if (err) {
        $message ={message:'Something went wrong'}
        req.flash("errors",err)
        return res.redirect('/edit-booth/'+id);
    } else {
        req.session.auth =result;
        $message ={msg:'Booth updated successfully'}
        req.flash("errors",$message)
        return res.redirect('/edit-booth/'+id);
    }
    });
}

   

