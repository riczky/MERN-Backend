const express = require('express');
const{body} = require('express-validator');

const router = express.Router();

const blogController = require('../controllers/blog');

// [POST] : /v1/blog/post
//Create
router.post('/post', 
    [body('title').isLength({min: 5}).withMessage('input title min 5 character'), 
    body('body').isLength({min: 5}).withMessage('input body min 5 character')],
    blogController.createBlogPost);


//[GET] : /v1/blog/posts
//Read
// Get All
// router.get('/posts', blogController.getAllBlogPost);

// Read Pagination
router.get('/posts', blogController.getAllBlogPost);


//[GET] : /v1/blog/posts/:postId
//Read Detail
router.get('/post/:postId', blogController.getBlogPostById);


//[PUT] : /v1/blog/post/:postId
// Update
router.put('/post/:postId', 
[body('title').isLength({min: 5}).withMessage('input title min 5 character'), 
body('body').isLength({min: 5}).withMessage('input body min 5 character')],
blogController.updateBlogPost);

//[Delete] : /v1/blog/post/:postId
//Delete
router.delete('/post/:postId', blogController.deleteBlogPost);




module.exports = router;










