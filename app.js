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


app.delete('/delete-school-ajax', function(req,res,next)
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



//Teachers
app.get('/teachers.hbs', function(req, res)
    {  
        let query1;                 // Define our query

        if (req.query.last_name === undefined)
        {
            query1 = "SELECT * FROM Teachers;"; 
        }
        else
        {
            query1 = `SELECT * FROM Teachers WHERE last_name LIKE "${req.query.last_name}%"`;
        }

        let query2 = "SELECT * FROM Schools;";

        db.pool.query(query1, function(error, rows, fields){    // Execute the query

            let teachers = rows;

            db.pool.query(query2, (error, rows, fields) => {

                let schools = rows;

                let schoolmap = {}
                schools.map(school => {
                    let school_id = parseInt(school.school_id, 10);

                    schoolmap[school_id] = school["school_name"];
                })

                teachers = teachers.map(teacher => {
                    return Object.assign(teacher, {school_id: schoolmap[teacher.school_id]})
                })

                return res.render('teachers', {data: teachers, schools: schools});  
            })

        })                                                      // an object where 'data' is equal to the 'rows' we
    });                                                         // received back from the query


app.post('/add-teacher-ajax', function(req, res)
{
    let data = req.body;

    //Capture NULL values
    let school_id = parseInt(data.school_id);
    if (isNaN(school_id))
    {
        school_id = 'NULL'
    }

    query1 = `INSERT INTO Teachers (school_id, first_name, last_name, date_of_birth, email) VALUES (${school_id}, '${data.first_name}', '${data.last_name}', '${data.date_of_birth}', '${data.email}' )`;
    db.pool.query(query1, function(error, rows, fields){

        if (error) {
            console.log(error)
            res.sendStatus(400);
        }
        else {
            query2 = `SELECT * FROM Teachers;`;
            db.pool.query(query2, function(error, rows, fields){

                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                }
                else {
                    res.send(rows);
                }
            })
        }
    })
});


app.delete('/delete-teacher-ajax', function(req, res, next) {
    let data = req.body;
    let teacherID = parseInt(data.teacher_id);
    let deleteTeachers = `DELETE FROM Teachers WHERE teacher_id = ?`;

    db.pool.query(deleteTeachers, [teacherID], function(error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        }
        else {
            res.sendStatus(204);
        }
    })
});


app.put('/put-teacher-ajax', function(req, res, next){
    let data = req.body;

    let school_id = parseInt(data.school_id);
    let teacher = parseInt(data.fullname);

    let queryUpdateSchool = `UPDATE Teachers SET school_id = ? WHERE Teachers.teacher_id = ?`;
    let selectSchool = `SELECT * FROM Schools WHERE school_id = ?`;

    db.pool.query(queryUpdateSchool, [school_id, teacher], function(error, rows, fields){
        if (error) {
            console.log(error);
            res.sendStatus(400);
        }
        else {
            db.pool.query(selectSchool, [school_id], function(error, rows, fields) {
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                }
                else {
                    res.send(rows);
                }
            })
        }
    })
});


//Students
app.get('/students.hbs', function(req, res)
    {  
        let query1;                 // Define our query

        if (req.query.last_name === undefined)
        {
            query1 = "SELECT * FROM Students;"; 
        }
        else
        {
            query1 = `SELECT * FROM Students WHERE last_name LIKE "${req.query.last_name}%"`;
        }

        let query2 = "SELECT * FROM Schools;";

        db.pool.query(query1, function(error, rows, fields){    // Execute the query

            let students = rows;

            db.pool.query(query2, (error, rows, fields) => {

                let schools = rows;

                let schoolmap = {}
                schools.map(school => {
                    let school_id = parseInt(school.school_id, 10);

                    schoolmap[school_id] = school["school_name"];
                })

                students = students.map(student => {
                    return Object.assign(student, {school_id: schoolmap[student.school_id]})
                })

                return res.render('students', {data: students, schools: schools});  
            })

        })                                                      // an object where 'data' is equal to the 'rows' we
    });                                                         // received back from the query


app.post('/add-student-ajax', function(req, res)
{
    let data = req.body;

    //Capture NULL values
    let school_id = parseInt(data.school_id);
    if (isNaN(school_id))
    {
        school_id = 'NULL'
    }

    query1 = `INSERT INTO Students (school_id, first_name, last_name, date_of_birth, email) VALUES (${school_id}, '${data.first_name}', '${data.last_name}', '${data.date_of_birth}', '${data.email}' )`;
    db.pool.query(query1, function(error, rows, fields){

        if (error) {
            console.log(error)
            res.sendStatus(400);
        }
        else {
            query2 = `SELECT * FROM Students;`;
            db.pool.query(query2, function(error, rows, fields){

                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                }
                else {
                    res.send(rows);
                }
            })
        }
    })
});


app.delete('/delete-student-ajax', function(req, res, next) {
    let data = req.body;
    let studentID = parseInt(data.student_id);
    let deleteStudents = `DELETE FROM Students WHERE student_id = ?`;

    db.pool.query(deleteStudents, [studentID], function(error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        }
        else {
            res.sendStatus(204);
        }
    })
});


app.put('/put-student-ajax', function(req, res, next){
    let data = req.body;

    let school_id = parseInt(data.school_id);
    let student = parseInt(data.fullname);

    let queryUpdateSchool = `UPDATE Students SET school_id = ? WHERE Students.student_id = ?`;
    let selectSchool = `SELECT * FROM Schools WHERE school_id = ?`;

    db.pool.query(queryUpdateSchool, [school_id, student], function(error, rows, fields){
        if (error) {
            console.log(error);
            res.sendStatus(400);
        }
        else {
            db.pool.query(selectSchool, [school_id], function(error, rows, fields) {
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                }
                else {
                    res.send(rows);
                }
            })
        }
    })
});


// Classes
app.get('/classes.hbs', function(req, res) {
    let query1;

    if (req.query.class_name === undefined)
    {
        query1 = "SELECT * FROM Classes;";
    }

    else
    {
        query1 = `SELECT * FROM Classes WHERE class_name LIKE "${req.query.class_name}%"`;
    }

    let query2 = "SELECT * FROM Teachers;";

    db.pool.query(query1, function(error, rows, fields) {

        let classes = rows;

        db.pool.query(query2, (error, rows, fields) => {
            let teachers = rows;

            let teachermap = {}
            teachers.map(teacher => {
                let teacher_id = parseInt(teacher.teacher_id, 10);

                teachermap[teacher_id] = teacher["last_name"];
            })

            classes = classes.map(aclass => {
                return Object.assign(aclass, {teacher_id: teachermap[aclass.teacher_id]})
            })

            return res.render('classes', {data: classes, teachers: teachers});
        })

    })
});


app.post('/add-class-ajax', function(req, res)
{
    let data = req.body;

    let teacher_id = parseInt(data.teacher_id);
    if (isNaN(teacher_id))
    {
        teacher_id = 'NULL'
    }

    query1 = `INSERT INTO Classes (teacher_id, class_name, class_section, max_students) VALUES (${teacher_id}, '${data.class_name}', '${data.class_section}', '${data.max_students}')`;
    db.pool.query(query1, function(error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        }
        else {
            query2 = `SELECT * FROM Classes;`;
            db.pool.query(query2, function(error, rows, fields) {
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                }
                else {
                    res.send(rows);
                }
            })
        }
    })
});


app.delete('/delete-class-ajax', function(req, res, next) {
    let data = req.body;
    let classID = parseInt(data.class_id);
    let deleteClasses = `DELETE FROM Classes WHERE class_id = ?`;

    db.pool.query(deleteClasses, [classID], function(error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        }
        else {
            res.sendStatus(204);
        }
    })
});


app.put('/put-class-ajax', function(req, res, next) {
    let data = req.body;

    let teacher_id = parseInt(data.teacher_id);
    let aclass = parseInt(data.classname);

    let queryUpdateTeacher = `UPDATE Classes SET teacher_id = ? WHERE Classes.class_id = ?`;
    let selectTeacher = `SELECT * FROM Teachers WHERE teacher_id = ?`;

    db.pool.query(queryUpdateTeacher, [teacher_id, aclass], function(error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        }
        else {
            db.pool.query(selectTeacher, [teacher_id], function(error, rows, fields) {
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.send(rows);
                }
            })
        }
    })
});

/*
    LISTENER
*/
app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});