const jwt = require("jsonwebtoken");
const {JWT_SECRET} = require("../solution/config");

function userMiddleware(req,res,next){
    const token = req.headers.Authorization;
    if(!token|| !token.startswith('Bearer')){
        return res.status(403).json({});
    }
    const words =  token.split(" ");
    const jwtToken = words[1];
    try{
       const decodedvalue = jwt.verify(jwtToken,JWT_SECRET);
       if(decodedvalue.userId){
       req.userId = decodedvalue.userId;
       next();}
       else{
        return res.status(403).json({})
       }
    }
       catch(err){
        return res.status(403).json({});
       }

};

module.exports ={

 userMiddleware
}