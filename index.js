let express = require('express');
let app = express();
let mongo = require('./server/db.js');
let util = require('./server/util.js');
let routes = require('./server/routes.js');
let path = require('path');

// Convert req.body to json
let bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Log incoming requests
let morgan = require('morgan');
morgan('tiny');

// Serve the client
app.use(express.static(path.join(__dirname, 'client')));
app.use(express.static(path.join(__dirname, '.')));

// Get all entries
app.get('/entries', routes.getEntries);

// Add entry, given weight or food
app.post('/entries', routes.postEntry);

// Delete entry, given date
app.delete('/entries', routes.deleteEntry);

// Update entry, given date, food and weight
app.put('/entries', routes.updateEntry);

app.listen( process.env.PORT || 3000);
console.log("listening on port",  process.env.PORT || 3000);






