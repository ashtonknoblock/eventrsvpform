const express = require('express');
const mongoose = require('mongoose');
const app = express();


const port = 3000;
app.use(express.json());
app.set('views', './views');
app.set('view engine', 'pug');

mongoose.connect('mongodb://localhost/rsvp', () => {
    console.log('database is connected...');
});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));
// Define a schema
var Schema = mongoose.Schema;
var responseSchema = new Schema({
    name: String,
    email: String,
    attending: Boolean,
    numGuests: {type: Number, min: 1, max: 8}
});
// Compile a Response model from the schema
var Response = mongoose.model('Response', responseSchema);

// Renders the main page with RSVP form
app.get('/', function (req, res) {
    res.render('main.pug', {title: 'Event RSVP'});
})

app.post('/reply', function (req, res, next) {
    // Create an instance of Response model
    // var response = new Response(req.body);
    var response = new Response({
        name: req.body.name,
        email: req.body.email,
        attending: req.body.attending,
        numGuests: req.body.numOfGuests
    });
    // Save to database
    response.save()
        .then(rsvp => {
            console.log('rsvp saved to the database');
            res.render('reply.pug', {title: 'Event RSVP'});
        })
        .catch(err => {
           console.log('Unable to save to database'); 
        });
})

app.get('/guests', function (req, res) {
    var attendingQuery = Response.find({attending: true});
    res.render('guestlist.pug', {title: 'Guest List'});
})

app.listen(port, () => {
    console.log(`listening on port ${port}`);
});

