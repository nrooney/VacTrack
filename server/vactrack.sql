


  -- +-------------------------+                  +----------------------+
  -- | Person                  |                  | Event                |
  -- |-------------------------|                  |----------------------|
  -- | name                    |----------------->| name                 |
  -- |                         |         ^        | coords               |
  -- +-------------------------+         |        | range                |
  --                                     |        | (extra_details)      |
  --                                     |        | time_stamp           |
  --                                     +        +----------------------+
  --                             +--------------+
  --                             | Transaction  |
  --                             |--------------|
  --                             | amount       |
  --                             |              |
  --                             +--------------+

-- TODO: Add Audit tables

CREATE TABLE tPerson (
id INTEGER NOT NULL PRIMARY KEY ASC AUTOINCREMENT,
name VARCHAR(255) NOT NULL
);


-- TODO: Create a tPlace for returns?
-- TODO: CHECK constraint for coords?
-- position_range - 1e-4 around 10m 
CREATE TABLE tEvent (
id INTEGER NOT NULL PRIMARY KEY ASC AUTOINCREMENT,
name VARCHAR(255) NOT NULL,
time_stamp TIMESTAMP NOT NULL,
latitude DECIMAL(9,6) NOT NULL,
longitude DECIMAL(9,6) NOT NULL,
position_range DECIMAL(9,6) DEFAULT 0.0001,
extra_details TEXT DEFAULT NULL
);

-- TODO: Create indexes for searching


-- Remember, amounts from the perspective of the pot!
CREATE TABLE tTransaction (
id INTEGER NOT NULL PRIMARY KEY ASC AUTOINCREMENT,
amount DECIMAL(5,2),
person NOT NULL REFERENCES tPerson(id),
event NOT NULL REFERENCES tEvent(id)
);
