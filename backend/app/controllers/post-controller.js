import path from "path";
import { Post } from "../models/posts-model.js";


// to create post
const createPost = async (req,res) => {
    const data = req.body
    data.mediaUrl = req.file.path
    data.user = req.userId
    console.log(data)
    try{
        const newPost =  new Post(data)
        await  newPost.save()
        res.json(newPost)
    }
    catch(error) {
        return res.status(500).json(error)
    }
}

// to get all posts whom the users follows
const getPosts = async (req,res) => {
    const id = req.userId
    try{
        // const currentUser = await User.findById(id).populate('following')

        // const followingIds = currentUser.following.map((user)=>user)

        // const posts = await Post.find({user : {$in : followingIds }}).sort({createdAt : -1})
        const posts = await Post.find().populate('user' , 'username').populate('postlikes' , 'username').populate('comments.user','username').sort({createdAt : -1})
        return res.status(200).json(posts)
    }
    catch(error){
        console.log(error)
        return res.status(500).json(error)
    }
}

// to get user posts
const getUserPosts = async (req,res) => {
    const id = req.userId
    try{
        const posts = await Post.find({user : id}).sort({createdAt : -1})
        if(!posts) {
             return res.status(404).json({msg : 'Not Found'})
        }
        res.status(200).json(posts)
    }
    catch(error) { 
        res.status(500).json(error)
    }
}

// to comments
const updateComments = async (req,res) => {
    const id = req.params.id
    const data = {
        user : req.userId,
        text : req.body.text
    }
    try{
        const post = await Post.findById(id)
        if(!post){
            return res.status(404).json({msg:'Post not Found'})
        }
        post.comments.unshift(data)
        await post.save()
        const updatedCmt = await Post.findById(id).populate('comments.user' , 'username')
        return res.status(200).send(updatedCmt.comments[0])
    }
    catch(error) {
        console.log(error)
        return res.status(500).json(error)
    }
}

// to likes
const updateLikes = async (req,res) => {
    const id = req.params.id
    const userId = req.userId
    try{
        const post = await Post.findById(id)
        if(!post){
            return res.status(404).json({msg:'post not found'})
        }
        const hasliked = post.postlikes.includes(userId)
        if(!hasliked){
            post.postlikes.push(userId)
            await post.save()
        
        }else{
           // console.log(post.likes)

            post.postlikes = post.postlikes.filter((likedUser) => likedUser.toString() !== userId.toString())
            await post.save()
        }

        const updatedPost = await Post.findById(id).populate('postlikes' , 'username',)
        const resPost = updatedPost.postlikes.find(ele => ele._id.toString() == req.userId.toString())
        const response = resPost || {_id : req.userId}
        
        res.status(202).json(response)
    }
    catch(error){
        console.log(error)
        return res.status(500).json(error)
    }
}

// to update the post
const updatePost = async (req,res) => {
    const postId = req.params.id
    const userId = req.userId
    const data = req.body
    if(req.file){
        data.mediaUrl = req.file.path
    }
    try{
        const post = await Post.findOneAndUpdate({ _id : postId ,user:userId},data,{new : true})
        if(!post){
            return res.status(404).json({})
        }
        return res.status(202).json(post)
    }
    catch(error){
        return res.status(500).json(error)
    }
}

// to delete the post
const deletePost = async (req,res) => {
    const postId = req.params.id
    const userId = req.userId
    try{
        const dltPost = await Post.findOneAndDelete({_id:postId , user : userId})
        if(!dltPost){
            return res.status(404).json({msg:'Not Found'})
        }
        return res.status(200).json(dltPost)
    }
    catch(error){
        return res.status(500).json(error)
    }
}

export const postController = {
    create: async (req, res) => {
        return await createPost(req, res);
    }, 
    getAll : async (req, res) => {
        return await getPosts(req, res);
    },
    get : async (req, res) => {
        return await getUserPosts(req, res);
    },
    comment : async (req, res) => {
        return await updateComments(req, res);
    },
    like : async (req, res) => {
        return await updateLikes(req, res);
    },
    update : async (req, res) => {
        return await updatePost(req, res);
    },
    delete : async (req, res) => {
        return await deletePost(req, res);
    }
}
