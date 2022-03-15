const blogModel = require("../models/blogModel")
const authorModel = require("../models/authorModel")
const moment = require("moment")
const { months } = require("moment")

const createBlog = async function (req, res) {
    try {
        const data = req.body
        const id = req.body.authorId
        if (!Object.keys(data).length > 0) return res.send({ error: "Please enter data" })

        const findAuthor = await authorModel.find({ _id: id })

        if (!findAuthor.length > 0) return res.status(400).send("error : Please enter valid authorId")

        const createdBlog = await blogModel.create(data)
        res.status(201).send({ Blog: createdBlog })
    }
    catch (err) {
        console.log(err)
        res.status(500).send({ msg: err.message })
    }
}


const getBlogs = async function( req , res ) {
    try{
        const data = req.query
        if(!data)  return res.status(400).send({error : "Enter some data to compare"})

        const blogs = await blogModel.find(data, { isDeleted : false } , {isPublished : true} ).populate("authorId")

        if( !blogs )   return res.status(404).send({error : "No such data found"})

        res.status(200).send({data : blogs})
    }
    catch (err) {
        console.log(err)
        res.status(500).send({ msg: err.message })
    }
}


const updateBlog= async function (req, res) {
    try {
    let data = req.body
    if ( !data )  return res.status(400).send({ error : "Enter some data to update"})     

    const timeDate = moment()

    const dataforUpdation = { ...data , isPublished : true , publishedAt : timeDate}
    const updatedData = await blogModel.findOneAndUpdate( { _id : id } , { $set : dataforUpdation} , { new : true} )

    if( !updatedData )  return res.status(404).send({error : "No such data found "})
    res.status(200).send( { msg: updatedData})
    }
    catch(error) {
        res.status(500).send(error.message)
    }
}



const deleteBlogByPath = async function (req, res) {
    try {
        const timeDate = moment()

        const dataforUpdation = { isDeleted : true , deletedAt : timeDate}

        let deletedBlog = await blogModel.findByIdAndUpdate({ _id: blogId }, dataforUpdation, { new: true });

        if( !deletedBlog)  return  res.status(404).send({ error : " No data exist"})
        res.status(200).send({ status: "Deleted", data: deletedBlog });

    }
    catch (err) {
        console.log(err)
        res.status(500).send({ msg: err.message })
    }
}



const deleteBlogByQuery = async function (req, res) {
    try {
        const data = req.query

        if (!data) return res.status(400).send({ error: "Please enter some data to campare" })

        const timeDate = moment()
        const dataforUpdation = { isDeleted : true , deletedAt : timeDate}

        const result = await blogModel.updateMany(data, dataforUpdation , { new: true })

        if (!result) res.status(404).send({ error: " No data found" })

        res.send({ status: "Deleted", data: result });
    }
    catch (err) {
        console.log(err)
        res.status(500).send({ msg: err.message })
    }
}

module.exports.createBlog = createBlog
module.exports.deleteBlogByQuery = deleteBlogByQuery
module.exports.deleteBlogByPath = deleteBlogByPath
module.exports.updateBlog = updateBlog
module.exports.getBlogs = getBlogs