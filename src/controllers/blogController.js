const { count } = require("console")
const blogModel = require("../models/blogModel")
const authorModel = require("../models/authorModel")

const isValid= function(value){
    if( typeof (value)=== 'undefined' || typeof (value)=== 'null'){
        return false
    } 
    if(value.trim().length==0){
        return false
    } if(typeof (value) === 'string' && value.trim().length >0 ){
        return true
    }
}

const createBlog = async function (req, res) {
    try {
        const data = req.body
        const id = req.body.authorId
        if (!Object.keys(data).length > 0) return res.status(400).send({ error: "Please enter title" })

        const{title} = data
        if( !isValid(title,) ){
            return res.status(400).send({ status : false, msg: 'please provide data'})
        }

        const findAuthor = await authorModel.find({ _id: id })

        if (!findAuthor.length > 0) return res.status(400).send("error : Please enter valid authorId")

        const createdBlog = await blogModel.create(data)
        return res.status(201).send({ Blog: createdBlog })
    }
    catch (err) {
        console.log(err)
        res.status(500).send({ msg: err.message })
    }
}



const getAllBlogs = async function( req , res ) {
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



const updateBlog = async function (req, res) {
    try {
        //  blogId is present in request path params or not.
        let blogId = req.params.blogId
        if (!blogId) return res.status(400).send({ status: false, msg: "Blog Id is required" })

        //  blogId is valid or not.
        let blog = await blogModel.findById(blogId)
        if (!blog) return res.status(404).send({ status: false, msg: "Blog does not exists" })

        // data for updation
        let title = req.body.title
        let body = req.body.body
        let tags = req.body.tags
        let subcategory = req.body.subcategory

        let updatedBlog = await blogModel.findOneAndUpdate({ _id: blogId },
            {
                $set: { title: title, body: body, isPublished: true , publishedAt: new Date() } ,
                $addToSet : { subcategory: subcategory ,tags: tags }
            }, { new: true })

        res.status(200).send({ status: true, data: updatedBlog })
    }
    catch (err) {
        console.log("This is the error :", err.message)
        res.status(500).send({ status: false, msg: " Server Error", error: err.message })
    }
}



const deleteBlogByPath = async function (req, res) {
    try {
        //  blogId is present in request path params or not.
        let blogId = req.params.blogId
        if (!blogId) return res.status(400).send({ status: false, msg: "Blog Id is required" })

        //  blogId is valid or not.
        let blog = await blogModel.findById(blogId)
        if (!blog) return res.status(404).send({ status: false, msg: "Blog does not exists" })

        // if blog is already deleted
        let isDeleted = await blogModel.findOne({ _id : blogId , isDeleted : true})
        if ( isDeleted ) return res.status(400).send({ status: false, msg: "Blog is already deleted" })

        // deleting blog
        let deletedBlog = await blogModel.findOneAndUpdate({ _id: blogId },
            { $set: { isDeleted: true, deletedAt: new Date() } }, { new: true })

        res.status(200).send({ status: true, data: deletedBlog })
    }
    catch (error) {
        res.status(500).send({ status: false, error: error.message })
    }
}

const deleteBlogByQuery = async function (req, res) {
    try {
        const data = req.query
        const blogId = req.query._id
        if (!Object.keys(data).length > 0) return res.status(400).send({ status: false, msg: "No input provided for filteration" })

        // checking if blog is already deleted
        let isDeleted = await blogModel.findOne({ _id : blogId , isDeleted : true})
        if ( isDeleted ) return res.status(400).send({ status: false, msg: "Blog is already deleted" })

        // deleting blog
        const deletedBlog = await blogModel.updateMany(data, { isDeleted: true, deletedAt: new Date() }, { new: true })
        if (!deletedBlog) return res.status(404).send({ status: false, msg: "no data found" })
        res.status(200).send({ status: true, msg: deletedBlog })
    }
    catch (error) {
        res.status(500).send({ status: false, msg: error.message });
    }
};



module.exports.createBlog = createBlog
module.exports.deleteBlogByQuery = deleteBlogByQuery
module.exports.deleteBlogByPath = deleteBlogByPath
module.exports.updateBlog = updateBlog
module.exports.getBlogs = getAllBlogs