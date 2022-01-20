const User = require('../models/User')
const Post = require('../models/Post');
const Message = require('../models/Message');


exports.getMessages = async (req, res) => {

    try {
        const userId = req.userId;
        const {receiver} = req.query;

        const user = await Message.findOne({user: userId}).populate("chats.messagesWith");
        
        const chat = user.chats.find(
            chat => chat.messagesWith._id.toString() === receiver
        );
        if (chat) {
            res.json({chat})
        } else {
            res.json([])
        }

        
    } catch (error) {
        return res.status(400).send('Error Get Messages');
    } 
}
