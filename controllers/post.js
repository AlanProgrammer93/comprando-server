const User = require('../models/User')
const Post = require('../models/Post');
const cloudinary = require('cloudinary');

// UPLOAD IMAGES CLOUDINARY
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

exports.uploadImage = async (req, res) => {
    let result = await cloudinary.uploader.upload(req.body.image, {
        public_id: `${req.userId}-${Date.now()}`,
        resource_type: 'auto'
    });
    res.json({
        public_id: result.public_id,
        url: result.secure_url,
    });
}

exports.removeImage = async (req, res) => {
    let image_id = req.body.public_id;
    
    cloudinary.uploader.destroy(image_id, (err, result) => {
        if (err) return res.json({success: false, err});
        res.send('ok');
    });
}
// UPLOAD IMAGES CLOUDINARY END

exports.postPublication = async (req, res) => {
    console.log(req.body);
    // Validar datos
    try {
        req.body.user = req.userId
        const newPublication = await new Post(req.body).save();
        res.json(newPublication);
    } catch (error) {
        return res.status(400).send('Error Publicar');
    }
}

exports.getPublications = async (req, res) => {
    const {pageNumber} = req.query;

    const number = Number(pageNumber);
    const size = 8;

    try {
        let posts;
        if (number === 1) {
            posts = await Post.find()
                .limit(size)
                .sort({ createdAt: -1 })
                .populate("user")
        } else {
            const skips = size * (number - 1);
            posts = await Post.find()
                .skip(skips)
                .limit(size)
                .sort({ createdAt: -1 })
                .populate("user")
        }
        
        if (posts.length === 0) {
            return res.json([]);
        }

        return res.json(posts);
    } catch (error) {
        console.error(error);
        return res.status(500).send('Error en el servidor');
    }
}

