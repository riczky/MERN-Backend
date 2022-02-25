const { json } = require('body-parser');
const {validationResult} = require('express-validator');
const BlogPost = require('../models/blog');
const path = require('path');
const fs = require('fs');


// Menambahkan data
exports.createBlogPost = (req, res, next) => {
        const errors = validationResult(req);

        // Cek Error
        if(!errors.isEmpty())
        {
           const err = new Error('Input Value Tidak Sesuai');
           err.errorStatus = 400;
           err.data = errors.array();
           throw err;
        }

        if(!req.file){
           const err = new Error('Image Harus di Upload');
           err.errorStatus = 422;
           err.data = errors.array();
           throw err;
        }

        const title = req.body.title;
        const image = req.file.path;
        const body = req.body.body;


        const Posting = new BlogPost({
            title: title,
            body: body,
            image: image,
            author: {uid: 1, name: 'riczky'}
        })

        Posting.save()
        .then( result => {
            res.status(201).json({
                message: 'Create Blog Post Success',
                data: result
            });
        })
        .catch(err => {
            console.log('err', err);
        });
       
}

//Get Data
// exports.getAllBlogPost = (req, res, next) => {
//     BlogPost.find()
//     .then(result => {
//         res.status(200).json({
//             message: 'Data Blog Post Berhasil Ditampilkan',
//             data: result
//         })
//     })
//     .catch(err => {
//         next(err);
//     })
// }


//Get Data Pagination
exports.getAllBlogPost = (req, res, next) => {
    const currentPage = req.query.page || 1;
    const perPage = req.query.perPage || 5;
    let totalItems;

    BlogPost.find().countDocuments()
    .then(count => {
        totalItems = count;
        return BlogPost.find()
        .skip((parseInt(currentPage) - 1) * parseInt(perPage))
        .limit(parseInt(perPage));
    })
    .then(result => {
        res.status(200).json({
            message: 'Data Blog Post Berhasil Ditampilkan',
            data: result,
            total_data: totalItems,
            per_page: parseInt(perPage),
            current_page: parseInt(currentPage)
        })
    })
    .catch(err => {
        next(err);
    })
}


//Get Data By Id
exports.getBlogPostById = (req, res, next) => {
    const postId = req.params.postId;
    BlogPost.findById(postId)
    .then(result => {
        if(!result){
            const error = new Error('Id Blog Post Tidak ditemukan!!');
            error.errorStatus = 404;
            throw error;    
        }
        res.status(200).json({
            message: 'Data Blog Post berhasil Ditampilkan Berdasarkan Id',
            data: result
        })
    })
    .catch(err => {
        next(err);
    })
}

// Update Data
exports.updateBlogPost = (req, res, next) => {
    const errors = validationResult(req);

    // Cek Error
    if(!errors.isEmpty())
    {
       const err = new Error('Input Value Tidak Sesuai');
       err.errorStatus = 400;
       err.data = errors.array();
       throw err;
    }

    if(!req.file){
       const err = new Error('Image Harus di Upload');
       err.errorStatus = 422;
       err.data = errors.array();
       throw err;
    }

    const title = req.body.title;
    const image = req.file.path;
    const body = req.body.body;
    const postId = req.params.postId;
     
    BlogPost.findById(postId)
    .then(post => {
        if(!post){
            const error = new Error('Id Blog Post Tidak ditemukan!!');
            error.errorStatus = 404;
            throw error;    
        }

        post.title = title;
        post.body = body;
        post.image = image;
        return post.save();
    })
    .then(result => {
        res.status(200).json({
            message: 'Data Berhasil di Update',
            data: result
        })
    })
    .catch(err => {
        next(err);
    })

}

// Delete Data
exports.deleteBlogPost = (req, res, next) => {
    const postId = req.params.postId;

    BlogPost.findById(postId)
    .then(post => {
        if(!post){
            const error = new Error('Id Blog Post Tidak ditemukan!!');
            error.errorStatus = 404;
            throw error;
        }

        removeImage(post.image);
        return BlogPost.findByIdAndRemove(postId);
    })
    .then(result => {
        res.status(200).json({
            message: 'Delete Berhasil',
            data: result
        })
    })
    .catch(err => {
        next(err);
    })
}

// Hapus Gambar
const removeImage = (filePath) => {
    console.log('filePath', filePath);
    console.log('dir name:', __dirname);

    filePath = path.join(__dirname, '../..', filePath)
    fs.unlink(filePath, err => console.log(err));
}



