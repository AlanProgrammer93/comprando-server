const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const postSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User" },
    images: {
        type: Array
    },
    description: {
        type: String,
        required: true,
        maxlength: 2000,
        text: true
    },
    price: { type: Number },
    location: { type: String },
},
{ timestamps: true });

module.exports = model("Post", postSchema);
