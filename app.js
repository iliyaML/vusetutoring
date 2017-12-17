const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const path = require('path');

const app = express();

const PORT = process.env.PORT || 5000;

// DB Config
const db = require('./config/database');

// Map global promise - get rid of warning
mongoose.Promise = global.Promise;
// Connect to MongoDB
mongoose.connect(db.mongoURI, {
    useMongoClient: true
})
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

// Models
require('./models/Tutor');
require('./models/Subject');
const Tutor = mongoose.model('tutors');
const Subject = mongoose.model('subjects');

// 
app.use(express.static(path.join(__dirname, 'public')));

// Express Handlebars Middleware
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Method Override Middleware
app.use(methodOverride('_method'));

// Index Page
app.get('/', (req, res) => {
    res.render('index');
});

// About Page
app.get('/about', (req, res) =>{
    res.render('about');
});

// Add Subject Form (GET)
app.get('/subjects/add', (req, res) => {
    res.render('subjects/add');
});

// Add Subject Form (POST)
app.post('/subjects/add', (req, res) => {
    let errors = [];
    const newSubject = {
        courseCode: req.body.courseCode,
        courseName: req.body.courseName
    };

    if (!newSubject.courseCode) {
        errors.push({ text: 'Please enter the course code' });
    }
    if (!newSubject.courseName) {
        errors.push({ text: 'Please enter the course name' });
    }

    if (errors.length > 0) {
        res.render('subjects/add', {
            errors: errors,
            newSubject: newSubject
        });
    } else {
        new Subject(newSubject)
            .save()
            .then(subject => {
                res.redirect('/subjects/all');
            });
    }
});

// List All Subjects
app.get('/subjects/all', (req, res) => {
    Subject.find({})
        .sort({ courseCode: 'asc' })
        .populate('tutors.tutorId')
        .then(subjects => {
            res.render('subjects/index', {
                subjects: subjects,
                totalSubjects: subjects.length,
                type: 'All'
            });
        });
});

app.get('/json', (req, res) => {
    Subject.find({})
        .sort({ courseCode: 'asc' })
        .populate('tutors.tutorId')
        .then(subjects => {
            res.json({
                subjects: subjects,
                totalSubjects: subjects.length,
                type: 'All'
            });
        });
});

// Specific Subject Page
app.get('/subjects/:courseCode', (req, res) => {
    Subject.findOne({ courseCode: req.params.courseCode })
        .populate('tutors.tutorId')
        .then(subject => {
            let onlineTutors = [];
            //console.log(subject.tutors);
            let tutors = subject.tutors;
                for(let x = 0, z = tutors.length; x < z; ++x){
                    console.log(tutors[x].tutorId.status);
                    if(subject.tutors[x].tutorId.status){
                        onlineTutors.push(tutors[x]);
                    }
                }
            res.render('subjects/code', {
                subject: subject,
                tutors: onlineTutors,
                totalTutors: onlineTutors.length 
            });
        });
});

// Specific Subject Page
app.get('/subjects/tutors/:courseCode', (req, res) => {
    Subject.findOne({ courseCode: req.params.courseCode })
        .then(subject => {
            Tutor.find({})
                .then(tutors => {
                    res.render('subjects/tutors', {
                        subject: subject,
                        tutors: tutors
                    });
                });
        });
});

// Specific Subject Page
app.post('/subjects/tutors', (req, res) => {
    Subject.findOne({ courseCode: req.body.courseCode })
        .then(subject => {
            const newTutor = {
                tutorId: req.body.tutorId
            };

            subject.tutors.unshift(newTutor);
            subject.save()
            .then(story => {
                res.redirect('/subjects/all');
            })
        });
});

// Tutors Index Page
app.get('/subjects', (req, res) => {
    Subject.find({})
        .sort({ courseCode: 'asc' })
        .populate('tutors.tutorId')
        .then(subjects => {
            let onlineSubjects = [];
            for(let i = 0, l = subjects.length; i < l; ++i){
                let onlineTutor = false;
                for(let x = 0, z = subjects[i].tutors.length; x < z; ++x){
                    if(subjects[i].tutors[x].tutorId.status){
                        onlineTutor = true;
                        break;
                    }
                }
                if(onlineTutor){
                    onlineSubjects.push(subjects[i]);
                }
            }
            res.render('subjects/index', {
                subjects: onlineSubjects,
                totalSubjects: onlineSubjects.length,
                type: 'Available'
            });
        });
});

// app.get('/json', (req, res) => {
//     Subject.find({})
//         .sort({ courseCode: 'asc' })
//         .populate('tutors.tutorId')
//         .then(subjects => {
//             let onlineSubjects = [];
//             for(let i = 0, l = subjects.length; i < l; ++i){
//                 let onlineTutor = false;
//                 for(let x = 0, z = subjects[i].tutors.length; x < z; ++x){
//                     if(subjects[i].tutors[x].tutorId.status){
//                         onlineTutor = true;
//                         break;
//                     }
//                 }
//                 if(onlineTutor){
//                     onlineSubjects.push(subjects[i]);
//                 }
//             }
//             res.json({
//                 subjects: onlineSubjects,
//                 totalSubjects: onlineSubjects.length,
//                 type: 'Available'
//             });
//         });
// });

app.get('/skeleton', (req, res) => {
    res.render('skeleton');
});

// Add Tutor Form (GET)
app.get('/tutors/add', (req, res) => {
    res.render('tutors/add');
});

// Add Tutor Form (POST)
app.post('/tutors/add', (req, res) => {
    let errors = [];
    const newTutor = {
        vunetId: req.body.vunetId,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        uniqueCode: req.body.uniqueCode,
        status: false
    };

    if (!newTutor.vunetId) {
        errors.push({ text: 'Please enter your VunetID' });
    }
    if (!newTutor.firstName) {
        errors.push({ text: 'Please enter your first name' });
    }
    if (!newTutor.lastName) {
        errors.push({ text: 'Please enter your last name' });
    }
    if (!newTutor.email) {
        errors.push({ text: 'Please enter your email' });
    }
    if (!newTutor.uniqueCode) {
        errors.push({ text: 'Please enter your unique code' });
    }

    if (errors.length > 0) {
        res.render('tutors/add', {
            errors: errors,
            newTutor: newTutor
        });
    } else {
        new Tutor(newTutor)
            .save()
            .then(tutor => {
                res.redirect('/tutors');
            });
    }
});

// TimeClock Page
app.get('/tutors/timeclock', (req, res) => {
    res.render('tutors/timeclock');
});

// Tutors Index Page
app.get('/tutors', (req, res) => {
    Tutor.find({})
        .then(tutors => {
            res.render('tutors/index', {
                tutors: tutors,
                totalTutors: tutors.length
            });
        });

});

// TimeClock Page (PUT)
app.put('/tutors/timeclock', (req, res) => {
    Tutor.findOne({
        uniqueCode: req.body.uniqueCode
    })
        .then(tutor => {
            if (!tutor.status) {
                tutor.status = true;
            } else {
                tutor.status = false;
            }

            tutor.save()
                .then(tutor => {
                    res.render('tutors/timeclock', {
                        tutor: tutor
                    });
                });
        });
});

app.listen(PORT, () => console.log(`Server listening at port ${PORT}`));