const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SubjectSchema = new Schema({
    courseCode: {
        type: String,
        required: true
    },
    courseName: {
        type: String,
        required: true
    },
    tutors: [{
        tutorId: {
            type: Schema.Types.ObjectId,
            ref: 'tutors'
        }
    }]
});

mongoose.model('subjects', SubjectSchema, 'subjects');