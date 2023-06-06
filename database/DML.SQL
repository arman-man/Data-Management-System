/*---------------------------------------------------------------------
|
|
|Companies
|
|
*-------------------------------------------------------------------*/

-- get all companies to display on the companies page
SELECT * FROM Companies;

-- add a new company
INSERT INTO Companies (name) VALUES (:nameInput);

-- update a company's data based on submission of the update company form 
UPDATE Companies SET name = :nameInput WHERE companyID = :companyID_from_the_update_form;

-- delete a company
DELETE FROM Companies WHERE companyID = :companyID_selected_from_companies_page;

/*---------------------------------------------------------------------
|
|
|Locations
|
|
*-------------------------------------------------------------------*/

-- get all locations to display on the locations page
SELECT * FROM Locations;

-- add a new location
INSERT INTO Locations (state, city) VALUES (:stateInput, :cityInput);

-- update a location's data based on submission of the update location form 
UPDATE Locations SET state = :stateInput, city = :cityInput WHERE locationID= :locationID_from_the_update_form;

-- delete a location
DELETE FROM Locations WHERE locationID = :locationID_selected_from_locations_page;

/*---------------------------------------------------------------------
|
|
|Companies_Locations
|
|
*-------------------------------------------------------------------*/

-- get all IDs and names from Companies to populate the companies dropdown for associating with a certificate
SELECT * FROM Companies;

-- get all IDs, states and cities from Locations to populate the locations dropdown for associating with a certificate
SELECT locationID, CONCAT(Locations.state, ', ',  Locations.city) AS location FROM Locations;

-- get all companies with their current associated locations to list
SELECT company_location_ID, Companies.name AS name, CONCAT(Locations.state, ', ',  Locations.city) AS location
FROM Companies_Locations
JOIN Companies ON Companies_Locations.companyID = Companies.companyID
JOIN Locations ON Companies_Locations.locationID = Locations.locationID;

-- associate a location with a company (M-to-M relationship addition)
INSERT INTO Companies_Locations (companyID, locationID) VALUES (:companyID_from_dropdown_Input, :locationID_from_dropdown_Input);

-- update a company_locations's data based on submission of the update company_location form
UPDATE Companies_Locations SET companyID = :companyID_from_dropdown_Input, locationID = :locationID_from_dropdown_Input WHERE company_location_ID= :company_location_ID_from_the_update_form;

-- disassociate a location with a company (M-to-M relationship addition)
DELETE FROM Companies_Locations WHERE company_location_ID = :company_location_ID_selected_from_companies_locations_page;

/*---------------------------------------------------------------------
|
|
|Postings
|
|
*-------------------------------------------------------------------*/

-- get all company locations from Companies_Locations to populate the company location dropdown
SELECT company_location_ID, CONCAT(Companies.name, ', ', Locations.state, ', ',  Locations.city) AS company_location
FROM Companies_Locations
JOIN Companies ON Companies_Locations.companyID = Companies.companyID
JOIN Locations ON Companies_Locations.locationID = Locations.locationID
ORDER BY Companies.name, Locations.state;

-- get all postings to display on the postings page
SELECT Postings.postingID, Postings.position, Postings.salary, CONCAT(Companies.name, ', ', Locations.state, ', ', Locations.city) AS company_location, Postings.source
FROM Postings
JOIN Companies_Locations ON Postings.company_location_ID = Companies_Locations.company_location_ID
JOIN Companies ON Companies_Locations.companyID = Companies.companyID
JOIN Locations ON Companies_Locations.locationID = Locations.locationID;

-- add a new posting
INSERT INTO Postings (position, salary, company_location_ID, source) VALUES (:positionInput, :salaryInput, :company_location_from_dropdown_Input, sourceInput);

-- update a postings's data based on submission of the update posting form 
UPDATE Postings SET position = :positionInput, salary = :salaryInput, company_location_ID =:company_location_from_dropdown_Input, source = :sourceInput WHERE postingID= :postingID_from_the_update_form;

-- delete a posting
DELETE FROM Postings WHERE postingID = :postingID_selected_from_postings_page;

/*---------------------------------------------------------------------
|
|
|Statuses
|
|
*-------------------------------------------------------------------*/

-- Get all statuses to display on the statuses page
SELECT * FROM Statuses;

-- add a new status
INSERT INTO Statuses (status) VALUES (:statusInput);

-- update a status's data based on submission of the update status form 
UPDATE Statuses SET status = :statusInput WHERE statusID= :statusID_from_the_update_form;

-- delete a status
DELETE FROM Statuses WHERE statusID = :statusID_selected_from_statuses_page;

/*---------------------------------------------------------------------
|
|
|Applications
|
|
*-------------------------------------------------------------------*/

-- get all names from Statuses to populate the status dropdown
SELECT * FROM Statuses;

-- get all applications to display on the applications page
SELECT Applications.applicationID, Applications.postingID, Statuses.status AS status, DATE_FORMAT(Applications.date, '%Y-%m-%d') AS date
FROM Applications
JOIN Statuses ON Applications.statusID = Statuses.statusID;

-- add a new application
INSERT INTO Applications (postingID, statusID, date) VALUES (:postingIDInput, :statusID_from_dropdown_Input, :dateInput);

-- delete an application
DELETE FROM Applications WHERE applicationID = :applicationID_selected_from_applications_page;
