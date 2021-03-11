var User = require("../../../models/User");
const timestamp = require('time-stamp');
created_date = timestamp.utc('YYYY-MM-DD HH:mm:ss');
var md5 = require('md5');
const { validationResult } = require ('express-validator');

module.exports.addClient = (req,res)=>{
    req.session.active = 'Client';
    if(typeof req.flash('formdata')=='undefined')
    {
        var formdata = {
            company_name:'',
            email:'',
            mobile_number:'',
            address:'',
            description:'',
            person_name:''
        };
        req.flash("formdata",formdata);
    }
    
    let active = 'Client';
    let title = 'Add Client';
     res.render('client/add_client',{active,title,formdata: req.flash('formdata'),errors:req.flash('errors'),reset:req.flash("reset")});
}

module.exports.addClientPost = (req,res)=>{

    var formdata = {company_name:req.body.company_name,email:req.body.email ,mobile_number:req.body.mobile_number,address:req.body.address,description:req.body.description,person_name:req.body.person_name};
    ///////////// Validate request//////////////////////////
    const errors = validationResult(req);
     
    let errorsData = {company_name:'',
                        email:'',
                        mobile_number:'',
                        address:'',
                        description:'',
                        person_name:''
                };
    if (errors.array().length > 0)
    { 
        errors.array().forEach((value)  => 
    {
        errorsData[value.param] = value.msg;    
    });

        req.flash("errors",errorsData); 
        req.flash("formdata",formdata); 
        return res.redirect('/add-client');
     }
    ////////////////////////////////////////////////////////////
    if(!req.body) {
        return res.status(400).send({
        message: "Note content can not be empty"
     });
    }


   
$where = {email:req.body.email};
User.findOne($where,function(err, user) 
    {
       if(user)
       {
        $message = {message:'Email already exist!'};
            req.flash('errors', $message);   
            req.flash("formdata",formdata); 
            return res.redirect('/add-client');
       
       }
       else{
            // Create a User
    const Users = new User({
       company_name:req.body.company_name,
       email:req.body.email,
       mobile_number:req.body.mobile_number,
       address:req.body.address,
       description:req.body.description,
       person_name:req.body.person_name,
       role:2,
       status:1,
       password_reset_code:0,
       profile_img:req.body.image_data,
       created_at:created_date,
       updated_at:created_date
    });

            // Save User in the database
            Users.save()
            .then(data => {
                $message = {msg:'Client saved successfully!'};
                req.flash('errors', $message);    
                return res.redirect('/add-client');
            }).catch(err => {
                $message = {message:'Some error occurred!'};
                req.flash('errors', $message);  
                return res.redirect('/add-client');
            
            })
        }
    });
 

}
   

module.exports.getClient = (req,res)=>{
    $where = {role:2};
    User.find($where,function(err, userObj){ 
        if(err){
          $message ={message:'Something went wrong'}
        req.flash("errors",$message)
        return res.redirect('/client-list');
        } 
        else{
          let data = userObj;
          let active = 'Client';
          let title =  'Client List';
             return  res.render('client/client_list',{active,title,data , errors:req.flash("errors"), message:req.flash("message")});
         
        }
      });
 
    
}


module.exports.editClient = (req,res)=>
{
    let id= req.params.id;
    User.findOne({_id:id},function(err, user)
    { 
       if(err)
       {
          $message ={message:'Something went wrong'}
          req.flash("errors",$message)
          return res.redirect('/edit-client');
       } 
       else
       {
          
          let data = user; 
          //data.profile_img = process.env.IMAGE_URL+user.profile_img;
         // console.log(data);
         let active = 'Client';
          let title =  'Edit Client';
         res.render('client/edit_client',{active,title,errors:req.flash("errors"),data});
        }
    });
}


module.exports.updateClient = (req,res)=>{
  
  let id = req.params.id;
  ///////////// Validate request//////////////////////////
  const errors = validationResult(req);
 
  let errorsData = {
    company_name:'',
    email:'',
    mobile_number:'',
    address:'',
    description:'',
    person_name:'' 
  };
  if (errors.array().length > 0)
  { 
    errors.array().forEach((value)  => 
    {
      errorsData[value.param] = value.msg;    
    });

    req.flash("errors",errorsData); 
    return res.redirect('/edit-client');
 }
////////////////////////////////////////////////////////////
    if(!req.body) {
        return res.status(400).send({
        message: "Note content can not be empty"
    });
    }
    if(req.body.image_data)
    {
        var where = { company_name:req.body.company_name,
            mobile_number:req.body.mobile_number,
            address:req.body.address,
            description:req.body.description,
            person_name:req.body.person_name,
            profile_img:req.body.image_data};
    }
    else{
        var where = { company_name:req.body.company_name,
            mobile_number:req.body.mobile_number,
            address:req.body.address,
            description:req.body.description,
            person_name:req.body.person_name,};
    }
    User.findByIdAndUpdate({ _id: id },where,{new: true}, function(err, result) {
    if (err) {
        $message ={message:'Something went wrong'}
        req.flash("errors",$message)
        return res.redirect('/edit-client/'+id);
    } else {
        req.session.auth =result;
        $message ={msg:'Client updated successfully'}
        req.flash("errors",$message)
        return res.redirect('/edit-client/'+id);
    }
    });
}

   

