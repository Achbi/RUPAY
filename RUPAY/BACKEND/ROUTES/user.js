const express = require("express");
const router = express.Router();
const {user} = require("../DATABASE/db");
const zod = require("zod");
const{password} = require("./type");
const{username} = require("./type");
const{first_name} = require("./type");
const{last_name} = require("./type");
const{JWT_SECRET} = require("../solution/config");
const{userMiddleware} = require("../middleware/usermiddleware");
const {updatebody} = require("./type");
const {account} = require("../DATABASE/db");
const jwt = require("jsonwebtoken")


router.post('/signup', async function(req,res){
    const username_ = req.body.username;
    const parseusername = username.safeParse(username_)

    if(!parseusername){
        res.status(411)({
            msg:"write correct username"
        })
        return;
    }
    const password_ = req.body.password;
    const parsepassword = password.safeParse(password_)

    if(!parsepassword){
        res.status(411)({
            msg:"write correct password"
        })
        return;
    }

    const firstname_ = req.body.first_name;
    const parsefirstname = first_name.safeParse(firstname_)

    if(!parsefirstname){
        res.status(411)({
            msg:"firstname should not be  between 0 to 20"
        })
        return;
    }


    const lastname_ = req.body.last_name;
    const parselastname = last_name.safeParse(lastname_)

    if(!parselastname){
        res.status(411)({
            msg:"lastname should not be  between 0 to 20"
        })
        return;
    }
    user.findOne({
        username:username_,
      }).maxTimeMS(30000)
      .then(function(value){
        if(value){
            res.json({
                msg: " user already exist"

            })
        }
        else{

            const db = user.create({
                username:username_,
                password:password_,
                first_name:firstname_,
                last_name:lastname_
              });
            const token = jwt.sign({
                userId: db._id
            },JWT_SECRET);
        
            res.json({
                Message: "admin created succesfully",
             
            })

        }
      })

    



     router.post('/signin',userMiddleware,async function(req,res){
        const username = req.body.username;
        const password = req.body.password;

        console.log(JWT_SECRET);
    
        const user = await user.find({
            username,
            password
        })
        if(user){
    
        const token = jwt.sign({
            username
    
        },JWT_SECRET);
        res.json({
            token:token
        })
        }
        else{
            res.status(411).json({
                messages:"incorrect"
            })
        }
    });


    router.put("/update",userMiddleware,async function(req,res){
        const success = updatebody.safeParse(req.body);
        if(!success){
            res.status(411)({
                message:"error while updating"
            })
       
        }
        await user.updateOne(req.body,{
            id:req.userId
        })
        res.json({
            message:"uppdate succesfully"
        })
        


    })
    router.get("/bulk",async function(req,res){
        const filter = req.query.filter || "";
        const users = await user.find({
            $or:[{
                first_name: {
                    "$regex":filter
                }


            },  {
                last_name:{
                    "$regex":filter
                }
            }]

        })

        res.json({
             user: users.map(user => ({
                username:user.username,
                first_name:user.first_name,
                last_name:user.last_name,
                _id: user._id

            }))
        })
    })
    

    


})

module.exports = router;