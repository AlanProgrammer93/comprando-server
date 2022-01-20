const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDb = require('./config/connectDB');

const { addUser, findConnectedUser } = require('./utilsSocket/users');
const { setMsgToUnread, sendMsg } = require('./utilsSocket/messages');

connectDb()

const app = express();

// Config Use
app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(express.json());
//app.use( express.static('public') );

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/posts', require('./routes/post'));
app.use('/api/messages', require('./routes/message'));

const PORT = process.env.PORT || 5000
var server = app.listen(PORT, () => console.log(`Server running port ${PORT}`))


// Config Socket
const io = require("socket.io")(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  },
  allowEIO3: true,
});

io.on("connection", (socket) => {

  socket.on('join', async ({ userId }) => {
    const users = await addUser(userId, socket.id);

    socket.emit("connectedUsers", {
      users: users.filter(user => user.userId !== userId)
    })
    socket.broadcast.emit("newUserJoin", { user: users.filter(user => user.userId === userId) })
  });

  socket.on("sendNewMsg", async ({ userId, msgSendToUserId, msg }) => {
    const { newMsg, error } = await sendMsg(userId, msgSendToUserId, msg);
    const receiverSocket = findConnectedUser(msgSendToUserId);

    if (receiverSocket) {
      io.to(receiverSocket.socketId).emit('newMsgReceived', { newMsg });
    } else {
      await setMsgToUnread(msgSendToUserId);
    }

    if (!error) {
      socket.emit("msgSent", { newMsg });
    }
  });
})


