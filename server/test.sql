INSERT INTO tPerson (name) VALUES ("firesock");
INSERT INTO tPerson (name) VALUES ("blu");
INSERT INTO tPerson (name) VALUES ("schuki");
INSERT INTO tPerson (name) VALUES ("weiho");

INSERT INTO tEvent (name, time_stamp, latitude, longitude) VALUES ("Dinner @ Dennys", "2013-07-31 13:00:00", 51.48482, -0.013905);
INSERT INTO tEvent (name, time_stamp, latitude, longitude, extra_details) VALUES ("Cheesecake Coma", "2013-07-31 15:00:00", 51.48482, -0.013905, "Oh my god. It's full of cheesecake!");

INSERT INTO tTransaction (event, amount, person) VALUES ((SELECT id FROM tEvent WHERE name = "Dinner @ Dennys"), 60.00, (SELECT id from tPerson WHERE name = "firesock"));
INSERT INTO tTransaction (event, amount, person) VALUES ((SELECT id FROM tEvent WHERE name = "Dinner @ Dennys"), -20.00, (SELECT id from tPerson WHERE name = "firesock"));
INSERT INTO tTransaction (event, amount, person) VALUES ((SELECT id FROM tEvent WHERE name = "Dinner @ Dennys"), -20.00, (SELECT id from tPerson WHERE name = "schuki"));
INSERT INTO tTransaction (event, amount, person) VALUES ((SELECT id FROM tEvent WHERE name = "Dinner @ Dennys"), -20.00, (SELECT id from tPerson WHERE name = "blu"));
INSERT INTO tTransaction (event, amount, person) VALUES ((SELECT id FROM tEvent WHERE name = "Cheesecake Coma"), 100.00, (SELECT id from tPerson WHERE name = "schuki"));
INSERT INTO tTransaction (event, amount, person) VALUES ((SELECT id FROM tEvent WHERE name = "Cheesecake Coma"), -25.00, (SELECT id from tPerson WHERE name = "schuki"));
INSERT INTO tTransaction (event, amount, person) VALUES ((SELECT id FROM tEvent WHERE name = "Cheesecake Coma"), -25.00, (SELECT id from tPerson WHERE name = "firesock"));
INSERT INTO tTransaction (event, amount, person) VALUES ((SELECT id FROM tEvent WHERE name = "Cheesecake Coma"), -25.00, (SELECT id from tPerson WHERE name = "blu"));
INSERT INTO tTransaction (event, amount, person) VALUES ((SELECT id FROM tEvent WHERE name = "Cheesecake Coma"), -25.00, (SELECT id from tPerson WHERE name = "weiho"));
