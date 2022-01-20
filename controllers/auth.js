const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/User')
const Post = require('../models/Post')
const Message = require('../models/Message');

exports.register = async (req, res) => {
    const { username, email, password } = req.body;
    let user = await User.findOne({ username });
    let emailExist = await User.findOne({ email });

    if (!username || !password || !email) {
        return res.status(400).json({
            msg: 'Todos los campos son requeridos.'
        });
    }

    if (user) {
        return res.status(400).json({
            msg: 'Existe una cuenta con ese nombre de usuario.'
        });
    }
    if (emailExist) {
        return res.status(400).json({
            msg: 'Existe una cuenta con ese correo.'
        });
    }

    // se puede validar lo mismo que en el front

    user = new User(req.body);

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    try {
        await user.save();
        await new Message({ user: user._id, chats: [] }).save();
        
        const payload = { userId: user._id };

        const dataResponse = {
            id: user._id,
            username: user.username,
            role: user.role,
            unreadMessage: user.unreadMessage,
            newMessagePopup: user.newMessagePopup
        }

        jwt.sign(payload, process.env.JWT_SECRET,
            { expiresIn: '2d' },
            (err, token) => {
                if (err) throw err;
                res.status(200).json({
                    user: dataResponse,
                    token
                });
            });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Ha ocurrido un error interno.'
        });
    }
}

exports.currentUser = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId).exec()
        const posts = await Post.find()
            .limit(6)
            .sort({ createdAt: -1 })
        
        if (user) {
            const dataResponse = {
                id: user._id,
                username: user.username,
                role: user.role,
                unreadMessage: user.unreadMessage,
                newMessagePopup: user.newMessagePopup,
                posts
            }
            jwt.sign({ userId }, process.env.JWT_SECRET,
                { expiresIn: '2d' },
                (err, token) => {
                    if (err) throw err;
                    res.status(200).json({
                        user: dataResponse,
                        token
                    });
                });
        }
    } catch (error) {
        return res.status(500).json({
            msg: 'Ha ocurrido un error interno.'
        });
    }
}

exports.login = async (req, res) => {
    const { email, password } = req.body;
    let user = await User.findOne({ email }).select('+password');
    const posts = await Post.find()
            .limit(6)
            .sort({ createdAt: -1 })

    if (!email || !password) {
        return res.status(400).json({
            msg: 'Todos los campos son requeridos.'
        });
    }

    if (!user) {
        return res.status(400).json({
            msg: 'Usuario o Contraseña Incorrecta.'
        });
    }

    try {
        if (bcrypt.compareSync(password, user.password)) {
            const payload = { userId: user._id };

            const dataResponse = {
                id: user._id,
                username: user.username,
                role: user.role,
                unreadMessage: user.unreadMessage,
                newMessagePopup: user.newMessagePopup,
                posts
            }

            jwt.sign(payload, process.env.JWT_SECRET,
                { expiresIn: '2d' },
                (err, token) => {
                    if (err) throw err;
                    res.status(200).json({
                        user: dataResponse,
                        token
                    });
                });
        } else {
            return res.status(400).json({
                msg: 'Usuario o Contraseña Incorrecta.'
            });
        }
        
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            msg: 'Usuario o Contraseña Incorrecta.'
        });
    }
}
