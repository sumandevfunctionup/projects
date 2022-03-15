const authorModel = require("../models/authorModel")
const jwt = require("jsonwebtoken")

const createAuthor = async function (req, res) {
    try {
        const data = req.body

        if ( !Object.keys(data).length > 0)  return res.status(400).send({ error : "Please enter data"})
        const createdauthor = await authorModel.create(data)
        res.status(201).send({data : createdauthor})
    }
    catch (err) {
        console.log(err)
        res.status(500).send({ msg: err.message })
    }
}



const loginAuthor = async function (req, res) {
    let email = req.body.email;
    let password = req.body.password;

    if( !email )  return  res.status(400).send({error : " Please , enter email Id"})
    if( !password )  return  res.status(400).send({error : " Please , enter password"})
  
    let user = await authorModel.findOne({ email: email, password: password });
    if (!user)
      return res.send({
        status: false,
        msg: "username or the password is not corerct",
      });
  
    let token = jwt.sign({ userId: user._id.toString() }, "secuiretyKeyToCheckToken" );
    res.setHeader("x-api-key", token);
    res.send({ status: "Author log-in successfully", data: token });
  }

module.exports.createAuthor = createAuthor
module.exports.loginAuthor = loginAuthor