/*
    SETUP
*/

// Server
var express = require('express');   // We are using the express library for the web server
var app = express();            // We need to instantiate an express object to interact with the server in the code
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
PORT = 42111;                 // Set a port number at the top so it's easy to change in the future

// Database
var db = require('./database/db-connector')

//Handlebars
const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');     // Import express-handlebars
app.engine('.hbs', engine({ extname: ".hbs" }));  // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');                 // Tell express to use the handlebars engine whenever it encounters a *.hbs file.

/*
    ROUTES
*/
app.get('/', function (req, res) {
    res.render('index');                    // Note the call to render() and not send(). Using render() ensures the templating engine
});

app.get('/companies', function (req, res) {
    // Define the query
    let query1;

    // If there is no query string, we just perform a basic SELECT
    if (req.query.name === undefined) {
        query1 = "SELECT * FROM Companies;";
    }
    // If there is a query string, we assume this is a search, and return desired results
    else {
        query1 = `SELECT * FROM Companies WHERE name LIKE "${req.query.name}%";`;
    }

    db.pool.query(query1, function (error, rows, fields) {    // Execute the query

        res.render('companies', { data: rows });                  // Render the companies.hbs file, and also send the renderer
    })                                                      // an object where 'data' is equal to the 'rows' we received back from the query
});

app.get('/locations', function (req, res) {
    // Define the query
    let query1;

    // If there is no query string, we just perform a basic SELECT
    if (req.query.state === undefined) {
        query1 = "SELECT * FROM Locations;";
    }
    // If there is a query string, we assume this is a search, and return desired results
    else {
        query1 = `SELECT * FROM Locations WHERE state LIKE "${req.query.state}%";`;
    }

    db.pool.query(query1, function (error, rows, fields) {    // Execute the query

        res.render('locations', { data: rows });                  // Render the locations.hbs file, and also send the renderer
    })                                                      // an object where 'data' is equal to the 'rows' we received back from the query
});

app.get('/companies_locations', function (req, res) {
    // Define the queries
    let query1;

    // If there is no query string, we just perform a basic SELECT
    if (req.query.name === undefined) {
        query1 = "SELECT company_location_ID, Companies.name AS name, CONCAT(Locations.state, ', ',  Locations.city) AS location\
        FROM Companies_Locations\
        JOIN Companies ON Companies_Locations.companyID = Companies.companyID\
        JOIN Locations ON Companies_Locations.locationID = Locations.locationID";

    }
    // If there is a query string, we assume this is a search, and return desired results
    else {
        query1 = `SELECT company_location_ID, Companies.name AS name, CONCAT(Locations.state, ', ',  Locations.city) AS location\
        FROM Companies_Locations\
        JOIN Companies ON Companies_Locations.companyID = Companies.companyID\
        JOIN Locations ON Companies_Locations.locationID = Locations.locationID\
        WHERE name LIKE "${req.query.name}%";`;
    }

    let query2 = "SELECT * FROM Companies;";

    let query3 = "SELECT locationID, CONCAT(Locations.state, ', ',  Locations.city) AS location FROM Locations;";

    // Execute the queries
    db.pool.query(query1, function (error, rows, fields) {

        let companies_locations = rows;

        db.pool.query(query2, function (error, rows, fields) {

            let companies = rows;

            db.pool.query(query3, function (error, rows, fields) {

                let locations = rows;

                res.render('companies_locations', { data: companies_locations, companies: companies, locations: locations });                  // Render the companies_locations.hbs file, and also send the renderer
            });                                                     // an object where 'data' is equal to the 'rows' we received back from the query
        });
    });
});

app.get('/postings', function (req, res) {
    // Define the query
    let query1;

    // If there is no query string, we just perform a basic SELECT
    if (req.query.position === undefined) {
        query1 = "SELECT Postings.postingID, Postings.position, Postings.salary, CONCAT(Companies.name, ', ', Locations.state, ', ', Locations.city) AS company_location, Postings.source\
        FROM Postings\
        JOIN Companies_Locations ON Postings.company_location_ID = Companies_Locations.company_location_ID\
        JOIN Companies ON Companies_Locations.companyID = Companies.companyID\
        JOIN Locations ON Companies_Locations.locationID = Locations.locationID;";
    }
    // If there is a query string, we assume this is a search, and return desired results
    else {
        query1 = `SELECT Postings.postingID, Postings.position, Postings.salary, CONCAT(Companies.name, ', ', Locations.state, ', ', Locations.city) AS company_location, Postings.source\
        FROM Postings\
        JOIN Companies_Locations ON Postings.company_location_ID = Companies_Locations.company_location_ID\
        JOIN Companies ON Companies_Locations.companyID = Companies.companyID\
        JOIN Locations ON Companies_Locations.locationID = Locations.locationID\
        WHERE position LIKE "${req.query.position}%";`;
    }

    let query2 = "SELECT company_location_ID, CONCAT(Companies.name, ', ', Locations.state, ', ',  Locations.city) AS company_location\
    FROM Companies_Locations\
    JOIN Companies ON Companies_Locations.companyID = Companies.companyID\
    JOIN Locations ON Companies_Locations.locationID = Locations.locationID\
    ORDER BY Companies.name, Locations.state;";

    // Execute the queries
    db.pool.query(query1, function (error, rows, fields) {

        let postings = rows;

        db.pool.query(query2, function (error, rows, fields) {

            let companies_locations = rows;

            res.render('postings', { data: postings, companies_locations: companies_locations });                  // Render the postings.hbs file, and also send the renderer
        })                                                      // an object where 'data' is equal to the 'rows' we received back from the query
    });
});

app.get('/statuses', function (req, res) {
    // Define the query
    let query1;

    // If there is no query string, we just perform a basic SELECT
    if (req.query.status === undefined) {
        query1 = "SELECT * FROM Statuses;";
    }
    // If there is a query string, we assume this is a search, and return desired results
    else {
        query1 = `SELECT * FROM Statuses WHERE status LIKE "${req.query.status}%";`;
    }

    db.pool.query(query1, function (error, rows, fields) {    // Execute the query

        res.render('statuses', { data: rows });                  // Render the statuses.hbs file, and also send the renderer
    })                                                      // an object where 'data' is equal to the 'rows' we received back from the query
});

app.get('/applications', function (req, res) {
    // Define the query
    let query1;

    // If there is no query string, we just perform a basic SELECT
    if (req.query.postingID === undefined) {
        query1 = "SELECT Applications.applicationID, Applications.postingID, Statuses.status AS status, DATE_FORMAT(Applications.date, '%Y-%m-%d') AS date\
        FROM Applications\
        JOIN Statuses ON Applications.statusID = Statuses.statusID;";
    }
    // If there is a query string, we assume this is a search, and return desired results
    else {
        query1 = `SELECT Applications.applicationID, Applications.postingID, Statuses.status AS status, DATE_FORMAT(Applications.date, '%Y-%m-%d') AS date\
        FROM Applications\
        JOIN Statuses ON Applications.statusID = Statuses.statusID\
        WHERE postingID LIKE "${req.query.postingID}%";`;
    }

    let query2 = "SELECT * FROM Statuses;";

    let query3 = "SELECT Postings.position, Postings.postingID, Companies_Locations.company_location_ID, CONCAT(Companies.name, ', ', Locations.state, ', ',  Locations.city) AS company_location\
	FROM Postings\
    JOIN Companies_Locations ON Postings.company_location_ID = Companies_Locations.company_location_ID\
    JOIN Companies ON Companies_Locations.companyID = Companies.companyID\
    JOIN Locations ON Companies_Locations.locationID = Locations.locationID\
    ORDER BY Companies.name, Locations.state;"

    // Execute the queries
    db.pool.query(query1, function (error, rows, fields) {

        let applications = rows;

        db.pool.query(query2, function (error, rows, fields) {

            let statuses = rows;

            db.pool.query(query3, function (error, rows, fields) {

                let postings = rows;

                res.render('applications', { data: applications, postings: postings, statuses: statuses });
            });                  // Render the applications.hbs file, and also send the renderer
        });                                                      // an object where 'data' is equal to the 'rows' we received back from the query
    });
});

app.post('/add-company-ajax', function (req, res) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
    query1 = `INSERT INTO Companies (name) VALUES ('${data.name}')`;
    db.pool.query(query1, function (error, rows, fields) {

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else {
            // If there was no error, perform a SELECT * on the table
            query2 = `SELECT * FROM Companies;`;
            db.pool.query(query2, function (error, rows, fields) {

                // If there was an error on the second query, send a 400
                if (error) {

                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else {
                    res.send(rows);
                }
            })
        }
    })
});

app.post('/add-location-ajax', function (req, res) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
    query1 = `INSERT INTO Locations (state, city) VALUES ('${data.state}', '${data.city}')`;
    db.pool.query(query1, function (error, rows, fields) {

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else {
            // If there was no error, perform a SELECT * on the table
            query2 = `SELECT * FROM Locations;`;
            db.pool.query(query2, function (error, rows, fields) {

                // If there was an error on the second query, send a 400
                if (error) {

                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else {
                    res.send(rows);
                }
            })
        }
    })
});

app.post('/add-company_location-ajax', function (req, res) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
    query1 = `INSERT INTO Companies_Locations (companyID, locationID) VALUES ('${data.companyID}', '${data.locationID}')`;
    db.pool.query(query1, function (error, rows, fields) {

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else {
            // If there was no error, perform a SELECT * on the table
            let query2 = "SELECT company_location_ID, Companies.name AS name, CONCAT(Locations.state, ', ',  Locations.city) AS location\
            FROM Companies_Locations\
            JOIN Companies ON Companies_Locations.companyID = Companies.companyID\
            JOIN Locations ON Companies_Locations.locationID = Locations.locationID;";
            db.pool.query(query2, function (error, rows, fields) {

                // If there was an error on the second query, send a 400
                if (error) {

                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else {
                    res.send(rows);
                }
            })
        }
    })
});

app.post('/add-posting-ajax', function (req, res) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
    query1 = `INSERT INTO Postings (position, salary, company_location_ID, source) VALUES ('${data.position}', '${data.salary}', '${data.company_location_ID}', '${data.source}')`;
    db.pool.query(query1, function (error, rows, fields) {

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else {
            // If there was no error, perform a SELECT * on the table
            let query2 = "SELECT Postings.postingID, Postings.position, Postings.salary, CONCAT(Companies.name, ', ', Locations.state, ', ', Locations.city) AS company_location, Postings.source\
            FROM Postings\
            JOIN Companies_Locations ON Postings.company_location_ID = Companies_Locations.company_location_ID\
            JOIN Companies ON Companies_Locations.companyID = Companies.companyID\
            JOIN Locations ON Companies_Locations.locationID = Locations.locationID;";

            db.pool.query(query2, function (error, rows, fields) {

                // If there was an error on the second query, send a 400
                if (error) {

                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else {
                    res.send(rows);
                }
            })
        }
    })
});

app.post('/add-status-ajax', function (req, res) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
    query1 = `INSERT INTO Statuses (status) VALUES ('${data.status}')`;
    db.pool.query(query1, function (error, rows, fields) {

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else {
            // If there was no error, perform a SELECT * on the table
            query2 = `SELECT * FROM Statuses;`;
            db.pool.query(query2, function (error, rows, fields) {

                // If there was an error on the second query, send a 400
                if (error) {

                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else {
                    res.send(rows);
                }
            })
        }
    })
});

app.post('/add-application-ajax', function (req, res) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
    query1 = `INSERT INTO Applications (postingID, statusID, date) VALUES ('${data.postingID}', '${data.statusID}', '${data.date}')`;
    db.pool.query(query1, function (error, rows, fields) {

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else {
            // If there was no error, perform a SELECT * on the table
            let query2 = "SELECT Applications.applicationID, Applications.postingID, Statuses.status AS status, DATE_FORMAT(Applications.date, '%Y-%m-%d') AS date\
            FROM Applications\
            JOIN Statuses ON Applications.statusID = Statuses.statusID;";

            db.pool.query(query2, function (error, rows, fields) {

                // If there was an error on the second query, send a 400
                if (error) {

                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else {
                    res.send(rows);
                }
            })
        }
    })
});

app.delete('/delete-company-ajax/', function (req, res, next) {
    let data = req.body;
    let companyID = parseInt(data.companyID);
    let delete_company_location = `DELETE FROM Companies_Locations WHERE companyID = ?;`;
    let deleteCompany = `DELETE FROM Companies WHERE companyID = ?;`;


    // Run the 1st query
    db.pool.query(delete_company_location, [companyID], function (error, rows, fields) {
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        }

        else {
            // Run the second query
            db.pool.query(deleteCompany, [companyID], function (error, rows, fields) {

                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.sendStatus(204);
                }
            })
        }
    })
});

app.delete('/delete-location-ajax/', function (req, res, next) {
    let data = req.body;
    let locationID = parseInt(data.locationID);
    let delete_company_location = `DELETE FROM Companies_Locations WHERE locationID = ?;`;
    let deleteLocation = `DELETE FROM Locations WHERE locationID = ?;`;


    // Run the 1st query
    db.pool.query(delete_company_location, [locationID], function (error, rows, fields) {
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        }

        else {
            // Run the second query
            db.pool.query(deleteLocation, [locationID], function (error, rows, fields) {

                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.sendStatus(204);
                }
            })
        }
    })
});

app.delete('/delete-company_location-ajax/', function (req, res, next) {
    let data = req.body;
    let company_location_ID = parseInt(data.company_location_ID);
    let deletPosting = `DELETE FROM Postings WHERE company_location_ID = ?;`;
    let delete_company_location = `DELETE FROM Companies_Locations WHERE company_location_ID = ?;`;


    // Run the 1st query
    db.pool.query(deletPosting, [company_location_ID], function (error, rows, fields) {
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        }

        else {
            // Run the second query
            db.pool.query(delete_company_location, [company_location_ID], function (error, rows, fields) {

                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.sendStatus(204);
                }
            })
        }
    })
});

app.delete('/delete-posting-ajax/', function (req, res, next) {
    let data = req.body;
    let postingID = parseInt(data.postingID);
    let deleteApplication = `DELETE FROM Applications WHERE postingID = ?;`;
    let deletePosting = `DELETE FROM Postings WHERE postingID = ?;`;


    // Run the 1st query
    db.pool.query(deleteApplication, [postingID], function (error, rows, fields) {
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        }

        else {
            // Run the second query
            db.pool.query(deletePosting, [postingID], function (error, rows, fields) {

                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.sendStatus(204);
                }
            })
        }
    })
});

app.delete('/delete-status-ajax/', function (req, res, next) {
    let data = req.body;
    let statusID = parseInt(data.statusID);
    let deleteApplication = `DELETE FROM Applications WHERE statusID = ?;`;
    let deleteStatus = `DELETE FROM Statuses WHERE statusID = ?;`;


    // Run the 1st query
    db.pool.query(deleteApplication, [statusID], function (error, rows, fields) {
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        }

        else {
            // Run the second query
            db.pool.query(deleteStatus, [statusID], function (error, rows, fields) {

                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.sendStatus(204);
                }
            })
        }
    })
});

app.delete('/delete-application-ajax/', function (req, res, next) {
    let data = req.body;
    let applicationID = parseInt(data.applicationID);
    let deleteApplication = `DELETE FROM Applications WHERE applicationID = ?;`;

    // Run the query
    db.pool.query(deleteApplication, [applicationID], function (error, rows, fields) {

        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.sendStatus(204);
        }
    })
});

app.put('/put-company-ajax', function (req, res, next) {
    let data = req.body;

    let companyID = parseInt(data.companyID);
    let name = data.name;

    let queryUpdateCompany = 'UPDATE Companies SET name = ? WHERE Companies.companyID = ?;';

    // Run the 1st query
    db.pool.query(queryUpdateCompany, [name, companyID], function (error, rows, fields) {
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        }
        else {
            // If there was no error, perform a SELECT * on the table
            query2 = `SELECT * FROM Companies;`;
            db.pool.query(query2, function (error, rows, fields) {

                // If there was an error on the second query, send a 400
                if (error) {

                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else {
                    res.send(rows);
                }
            })
        }
    })
});

app.put('/put-location-ajax', function (req, res, next) {
    let data = req.body;

    let locationID = parseInt(data.locationID);
    let state = data.state;
    let city = data.city;

    let queryUpdateStatus = 'UPDATE Locations SET state = ?, city = ? WHERE Locations.locationID= ?;';

    // Run the 1st query
    db.pool.query(queryUpdateStatus, [state, city, locationID], function (error, rows, fields) {
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        }
        else {
            // If there was no error, perform a SELECT * on the table
            query2 = `SELECT * FROM Locations;`;
            db.pool.query(query2, function (error, rows, fields) {

                // If there was an error on the second query, send a 400
                if (error) {

                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else {
                    res.send(rows);
                }
            })
        }
    })
});

app.put('/put-company_location-ajax', function (req, res, next) {
    let data = req.body;

    let company_location_ID = parseInt(data.company_location_ID);
    let companyID = parseInt(data.companyID);
    let locationID = parseInt(data.locationID);

    let queryUpdateStatus = 'UPDATE Companies_Locations SET companyID = ?, locationID = ? WHERE Companies_Locations.company_location_ID= ?;';

    // Run the 1st query
    db.pool.query(queryUpdateStatus, [companyID, locationID, company_location_ID], function (error, rows, fields) {
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        }
        else {
            // If there was no error, perform a SELECT * on the table
            query2 = "SELECT company_location_ID, Companies.name AS name, CONCAT(Locations.state, ', ',  Locations.city) AS location\
            FROM Companies_Locations\
            JOIN Companies ON Companies_Locations.companyID = Companies.companyID\
            JOIN Locations ON Companies_Locations.locationID = Locations.locationID;";

            db.pool.query(query2, function (error, rows, fields) {
                // If there was an error on the second query, send a 400
                if (error) {

                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else {
                    res.send(rows);
                }
            })
        }
    })
});

app.put('/put-status-ajax', function (req, res, next) {
    let data = req.body;

    let statusID = parseInt(data.statusID);
    let status = data.status;

    let queryUpdateStatus = 'UPDATE Statuses SET status = ? WHERE Statuses.statusID= ?;';

    // Run the 1st query
    db.pool.query(queryUpdateStatus, [status, statusID], function (error, rows, fields) {
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        }
        else {
            // If there was no error, perform a SELECT * on the table
            query2 = `SELECT * FROM Statuses;`;
            db.pool.query(query2, function (error, rows, fields) {

                // If there was an error on the second query, send a 400
                if (error) {

                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else {
                    res.send(rows);
                }
            })
        }
    })
});

app.put('/put-posting-ajax', function (req, res, next) {
    let data = req.body;

    let postingID = parseInt(data.postingID);
    let position = data.position;
    let salary = data.salary;
    let company_location_ID = parseInt(data.company_location_ID);
    let source = data.source;

    let queryUpdateStatus = 'UPDATE Postings SET position = ?, salary = ?, company_location_ID = ?, source = ? WHERE Postings.postingID= ?;';

    // Run the 1st query
    db.pool.query(queryUpdateStatus, [position, salary, company_location_ID, source, postingID], function (error, rows, fields) {
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        }
        else {
            // If there was no error, perform a SELECT * on the table
            query2 = "SELECT Postings.postingID, Postings.position, Postings.salary, CONCAT(Companies.name, ', ', Locations.state, ', ', Locations.city) AS company_location, Postings.source\
            FROM Postings\
            JOIN Companies_Locations ON Postings.company_location_ID = Companies_Locations.company_location_ID\
            JOIN Companies ON Companies_Locations.companyID = Companies.companyID\
            JOIN Locations ON Companies_Locations.locationID = Locations.locationID;";

            db.pool.query(query2, function (error, rows, fields) {
                // If there was an error on the second query, send a 400
                if (error) {

                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else {
                    res.send(rows);
                }
            })
        }
    })
});

/*
    LISTENER
*/
app.listen(PORT, function () {            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});