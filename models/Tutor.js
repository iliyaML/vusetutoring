const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TutorSchema = new Schema({
    uniqueCode: {
        type: Number,
        required: true
    },
    vunetId: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        required: true,
        default: false
    }
});

mongoose.model('tutors', TutorSchema);