if(process.env.NODE_ENV === 'production'){
    module.exports = {
        mongoURI: 'mongodb://admin:admin123*@ds113660.mlab.com:13660/vandystemtutoring'
    }
} else {
    module.exports = {
        mongoURI: 'mongodb://localhost/stemtutoring'
    }
}