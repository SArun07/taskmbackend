const mongoose = require('mongoose');
const { Schema } = mongoose;

const NotesSchema = new Schema({
    //  ye karne par hum user ko store kar sakta hu
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    title:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    tag:{
        type: String,
        default: "General"
    },
    status:{
        type: String,
        default: "General"
    },
    date:{
        type: Date,
        default: Date.now // is date ko call nhi karna hai
    }
  });

  module.exports = mongoose.model('notes', NotesSchema);