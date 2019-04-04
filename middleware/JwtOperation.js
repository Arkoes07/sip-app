const jwt = require('jsonwebtoken')

class JwtOperation {
    constructor(){
        this.verifyToken = (req,res,next) => {
            const bearerHeader = req.headers['authorization'];
            console.log(bearerHeader)
            if(typeof bearerHeader !== "undefined"){
                const bearer = bearerHeader.split(' ')
                const bearerToken = bearer[1]
                jwt.verify(bearerToken, 'secretkey', (err, authData) => {
                    if(err){
                        res.sendStatus(403)
                    }else{
                        req.authData = authData;
                        next()
                    }
                })
            }else{
                res.sendStatus(403);   
            }
        }
    }

}

module.exports = JwtOperation
