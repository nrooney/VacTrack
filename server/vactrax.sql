



CREATE TABLE Persons
(
Id int NOT NULL,
name varchar(255) NOT NULL,

PRIMARY KEY (Id)
)

CREATE TABLE Event
(
Id int NOT NULL,
name varchar(255) NOT NULL,
latitude DECIMAL(9,6) NOT NULL,
longitude DECIMAL(9,6) NOT NULL,


PRIMARY KEY (Id)
)




CREATE TABLE Transaction
(
Id int NOT NULL,
  varchar(255) NOT NULL,
PRIMARY KEY (Id)
)