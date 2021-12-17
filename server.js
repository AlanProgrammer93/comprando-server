const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDb = require('./config/connectDB');
connectDb()

const app = express();

// Config Use
app.use(cors());
app.use(express.json({limit: '2mb'}));
app.use(express.json());
//app.use( express.static('public') );

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/posts', require('./routes/post'));

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

})
    
