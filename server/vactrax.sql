
CREATE TABLE tPerson
(
id int NOT NULL,
name varchar(255) NOT NULL,

PRIMARY KEY (id)
)



CREATE TABLE tEvent
(
id int NOT NULL,
name varchar(255) NOT NULL,
time_stamp DATETIME NOT NULL,
latitude DECIMAL(9,6) NOT NULL,
longitude DECIMAL(9,6) NOT NULL,
position_range DECIMAL(9,6) DEFAULT 0.0001, --1e-4 around 10m 
extra_details TEXT,
PRIMARY KEY (id)
)




CREATE TABLE tTransaction
(
id int NOT NULL,
amount DECIMAL(5,2),
PRIMARY KEY (id)
)