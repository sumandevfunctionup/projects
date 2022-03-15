const jwt = require("jsonwebtoken")

const authentication = async function ( req , res , next ) {
    let isToken = req.headers["x-api-key"]
    if ( !isToken ) {
        res.send({ status: false, msg: "token must be present" });
    }
 
    let decodedToken = jwt.verify(isToken, "secuiretyKeyToCheckToken");
    if ( !decodedToken ) {
        res.send({ status: false, msg: "token is invalid" });
    }

    next();

}


const authorization = async function ( req , res , next ) {
    let isToken = req.headers["x-api-key"]
 
    let decodedToken = jwt.verify(isToken, "secuiretyKeyToCheckToken");

    let userId = req.params.userId
    if( !userId )   userId = req.query._id
    if( !userId )   return res.status(400).send({error : " Please , enter userId"})

    if ( decodedToken.userId != userId ) {
        return res.send({ error : " LogedIn user is not authorize to change with requested userid"})
    }
    
    next();

}


module.exports.authorization = authorization
module.exports.authentication = authentication
