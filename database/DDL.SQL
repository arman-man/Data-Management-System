SET FOREIGN_KEY_CHECKS 	= 0;
SET AUTOCOMMIT = 0;

/*---------------------------------------------------------------------
|
|
|Table Creation
|
|
*-------------------------------------------------------------------*/
CREATE OR REPLACE TABLE Companies (
    companyID int NOT NULL AUTO_INCREMENT,
    name varchar(255) NOT NULL,
    PRIMARY KEY (companyID)
);

CREATE OR REPLACE TABLE Locations (
    locationID int NOT NULL AUTO_INCREMENT,
    state varchar(255) NOT NULL,
    city varchar(255) NOT NULL,
    PRIMARY KEY (locationID)
);

CREATE OR REPLACE TABLE Companies_Locations (
    company_location_ID int NOT NULL AUTO_INCREMENT,
    companyID int NOT NULL,
    locationID int NOT NULL,
    PRIMARY KEY (company_location_ID),
    FOREIGN KEY (companyID) REFERENCES Companies(companyID) ON DELETE CASCADE,
    FOREIGN KEY (locationID) REFERENCES Locations(locationID) ON DELETE CASCADE
);

CREATE OR REPLACE TABLE Postings (
    postingID int NOT NULL AUTO_INCREMENT,
    position varchar(255) NOT NULL,
    salary int DEFAULT NULL,
    company_location_ID int NOT NULL,
    source varchar(255) NOT NULL,
    PRIMARY KEY (postingID),
    FOREIGN KEY (company_location_ID) REFERENCES Companies_Locations(company_location_ID) ON DELETE CASCADE
);

CREATE OR REPLACE TABLE Statuses (
    statusID int NOT NULL AUTO_INCREMENT,
    status varchar(255) NOT NULL,
    PRIMARY KEY (statusID)
);

CREATE OR REPLACE TABLE Applications (
    applicationID int NOT NULL AUTO_INCREMENT,
    postingID int NOT NULL,
    statusID int DEFAULT NULL,
    date date NOT NULL,
    PRIMARY KEY (applicationID),
    FOREIGN KEY (postingID) REFERENCES Postings(postingID) ON DELETE CASCADE,
    FOREIGN KEY (statusID) REFERENCES Statuses(statusID) ON DELETE CASCADE
);

/*---------------------------------------------------------------------
|
|
|Inserting Data
|
|
*-------------------------------------------------------------------*/
INSERT INTO Companies (name)
VALUES('Amazon'),
('Apple'),
('Google'),
('Meta'),
('Microsoft');

INSERT INTO Locations (state, city)
VALUES('California', 'Los Angeles'),
('California', 'San Francisco'),
('New York', 'New York'),
('Texas', 'Austin'),
('Texas', 'Dallas');

INSERT INTO Companies_Locations (companyID, locationID)
VALUES(1, 1),
(1, 4),
(5, 3),
(2, 2),
(3, 2);

INSERT INTO Postings (position, salary, company_location_ID, source) 
VALUES('Software Engineer', 120000, 1, 'https://www.linkedin.com/jobs/view/3585966603'),
('Front-End Developer', 110000, 4, 'https://www.ziprecruiter.com/job/4120a891'),
('Back-End Developer', 135000, 2, 'https://www.linkedin.com/jobs/view/3572760668'),
('Full-Stack Developer', 160000, 3, 'https://www.ziprecruiter.com/job/207b7faa'),
('Node.js Developer', 140000, 5, 'https://www.linkedin.com/jobs/view/3582145188');

INSERT INTO Statuses (status) 
VALUES('applied'),
('interview'),
('rejected'),
('hired');

INSERT INTO Applications (postingID, statusID, date)
VALUES(5, 1, '2023-03-08'),
(3, 1, '2023-03-10'),
(5, 2, '2023-03-15'),
(1, 1, '2023-03-17'),
(5, 4, '2023-03-27');

SET FOREIGN_KEY_CHECKS = 1;
COMMIT;
