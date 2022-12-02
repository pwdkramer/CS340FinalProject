// App.js

/*
    SETUP
*/
var express = require('express');   // We are using the express library for the web server
var app     = express();            // We need to instantiate an express object to interact with the server in our code
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))
PORT        = 4257;                 // Set a port number at the top so it's easy to change in the future
// Database
var db = require('./database/db-connector')

const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');     // Import express-handlebars
app.engine('.hbs', engine({extname: ".hbs"}));  // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');                 // Tell express to use the handlebars engine whenever it encounters a *.hbs file.

/*
    ROUTES
*/
//Index
app.get('/', function(req, res)
    {
        res.render('index');                    // Note the call to render() and not send(). Using render() ensures the templating engine
    });                                         // will process this file, before sending the finished HTML to the client.


//Schools
app.get('/schools.hbs', function(req, res)
    {  
        let query1;                 // Define our query

        if(req.query.school_name === undefined)
        {
            query1 = "SELECT * FROM Schools;";
        }
        else
        {
            query1 = `SELECT * FROM Schools WHERE school_name LIKE "${req.query.school_name}%"`;
        }

        db.pool.query(query1, function(error, rows, fields){    // Execute the query
            let schools = rows;

            res.render('schools', {data: schools});                // Render the schools.hbs file, and also send the renderer
        })                                                      // an object where 'data' is equal to the 'rows' we
    });                                                         // received back from the query


app.post('/add-school-ajax', function(req, res) 
    {
        // Capture the incoming data and parse it back to a JS object
        let data = req.body;
    
        // Create the query and run it on the database
        query1 = `INSERT INTO Schools (school_name) VALUES ('${data.school_name}')`;
        db.pool.query(query1, function(error, rows, fields){
    
            // Check to see if there was an error
            if (error) {
    
                // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                console.log(error)
                res.sendStatus(400);
            }
            else
            {
                // If there was no error, perform a SELECT * on bsg_people
                query2 = `SELECT * FROM Schools;`;
                db.pool.query(query2, function(error, rows, fields){
    
                    // If there was an error on the second query, send a 400
                    if (error) {
                        
                        // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                        console.log(error);
                        res.sendStatus(400);
                    }
                    // If all went well, send the results of the query back.
                    else
                    {
                        res.send(rows);
                    }
                })
            }
        })
    });


app.delete('/delete-school-ajax/', function(req,res,next)
    {
    let data = req.body;
    let schoolID = parseInt(data.school_id);
    let deleteSchools = `DELETE FROM Schools WHERE school_id = ?`;

        db.pool.query(deleteSchools, [schoolID], function(error, rows, fields){

            if (error) {
                console.log(error);
                res.sendStatus(400);
            }
            else
            {
                res.sendStatus(204);
            }
        })});

/*
    LISTENER
*/
app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});