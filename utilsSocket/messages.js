const Message = require("../models/Message");
const User = require("../models/User");


const sendMsg = async (userId, msgSendToUserId, msg) => {
    try {
        const user = await Message.findOne({ user: userId });
        const msgSendToUser = await Message.findOne({ user: msgSendToUserId });

        const newMsg = {
            sender: userId,
            receiver: msgSendToUserId,
            msg,
            date: Date.now()
        }

        const previousChat = user.chats.find(chat => chat.messagesWith.toString() === msgSendToUserId);

        if (previousChat) {
            previousChat.messages.push(newMsg);
            await user.save();
        } else {
            const newChat = { messagesWith: msgSendToUserId, messages: [newMsg] };
            user.chats.unshift(newChat);
            await user.save();
        }

        const previousChatForReceiver = msgSendToUser.chats.find(
            chat => chat.messagesWith.toString() === userId
        );

        if (previousChatForReceiver) {
            previousChatForReceiver.messages.push(newMsg);
            await msgSendToUser.save();
        } else {
            const newChat = { messagesWith: userId, messages: [newMsg] };
            msgSendToUser.chats.unshift(newChat);
            await msgSendToUser.save();
        }

        return  {newMsg} 
    } catch (error) {
        console.error(error);
        return { error }
    }
}

const setMsgToUnread = async userId => {
    try {
        const user = await User.findById(userId);

        if (!user.unreadMessage) {
            user.unreadMessage = true;
            await user.save();
        }

        return;
    } catch (error) {
        console.error(error);
    }
}

module.exports = { sendMsg, setMsgToUnread }
