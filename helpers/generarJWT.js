const jwt = require("jsonwebtoken");

const generarJWT = (uid = '') => {

    return new Promise((resolve, reject) => {

        const payload = { uid }
        const secrect = process.env.SECRETKEY;

        jwt.sign(payload, secrect,{
            expiresIn:'7d'
        },(err,token)=>{


            if(err){
                console.log(err);
                reject(err);
            }else{
                resolve(token);
            }
            
        })        
    })

}

module.exports = { generarJWT };