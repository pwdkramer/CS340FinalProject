-- SQL for CS340 Project Part 2 Draft

SET FOREIGN_KEY_CHECKS=0;
SET AUTOCOMMIT = 0;

-- Make tables

CREATE OR REPLACE TABLE Schools (
    school_id int NOT NULL AUTO_INCREMENT,
    school_name varchar(255) NOT NULL,
    PRIMARY KEY (school_id)
);

CREATE OR REPLACE TABLE Teachers (
    teacher_id int NOT NULL AUTO_INCREMENT,
    school_id int,
    first_name varchar(255) NOT NULL,
    last_name varchar(255),
    date_of_birth date NOT NULL,
    email varchar(255) NOT NULL,
    PRIMARY KEY (teacher_id),
    FOREIGN KEY (school_id) REFERENCES Schools(school_id)
    ON UPDATE CASCADE
    ON DELETE SET NULL
);

CREATE OR REPLACE TABLE Students (
    student_id int NOT NULL AUTO_INCREMENT,
    school_id int,
    first_name varchar(255) NOT NULL,
    last_name varchar(255),
    date_of_birth date NOT NULL,
    email varchar(255) NOT NULL,
    PRIMARY KEY (student_id),
    FOREIGN KEY (school_id) REFERENCES Schools(school_id)
    ON UPDATE CASCADE
    ON DELETE SET NULL
);

CREATE OR REPLACE TABLE Classes (
    class_id int NOT NULL AUTO_INCREMENT,
    teacher_id int,
    class_name varchar(255) NOT NULL,
    class_section int NOT NULL,
    max_students int NOT NULL,
    PRIMARY KEY (class_id),
    FOREIGN KEY (teacher_id) REFERENCES Teachers(teacher_id)
    ON UPDATE CASCADE
    ON DELETE SET NULL
);

CREATE OR REPLACE TABLE Students_Classes (
    class_id int,
    student_id int,
    PRIMARY KEY (class_id, student_id),
    FOREIGN KEY (class_id) REFERENCES Classes(class_id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES Students(student_id)
    ON UPDATE CASCADE
    ON DELETE CASCADE
);

-- Add sample data

INSERT INTO Schools (
    school_name
)
VALUES
(
    "Westview"
),
(
    "Eastview"
),
(
    "Southview"
);

INSERT INTO Teachers (
    school_id,
    first_name,
    last_name,
    date_of_birth,
    email
)
VALUES
(
    1,
    "Joe",
    "Burton",
    '1995-02-12',
    "jburton@lssd.org"
),
(
    1,
    "Mary",
    "Johnson",
    '1988-04-16',
    "mjohnson@lssd.org"
),
(
    1,
    "Peter",
    "Piper",
    '1979-08-20',
    "ppiper@lssd.org"
),
(
    2,
    "Susan",
    "Strong",
    '1992-09-25',
    'sstrong@lssd.org'
),
(
    2,
    "Finn",
    "Murtons",
    '2000-10-31',
    "fmurtons@lssd.org"
);

INSERT INTO Classes (
    teacher_id,
    class_name,
    class_section,
    max_students
)
VALUES
(
    4,
    "P.E.",
    1,
    40
),
(
    2,
    "Math",
    1,
    30
),
(
    5,
    "History",
    1,
    25
),
(
    1,
    "Science",
    1,
    30
),
(
    3,
    "Music",
    1,
    25
);

INSERT INTO Students (
    school_id,
    first_name,
    last_name,
    date_of_birth,
    email
)
VALUES
(
    1,
    "Little",
    "Kid",
    '2007-04-25',
    "myemail@me.com"
),
(
    1,
    "Older",
    "Child",
    '2011-11-11',
    "bigboy@gmail.com"
),
(
    2,
    "Jacob",
    "Winters",
    '2010-09-25',
    "jwinters@gmail.com"
),
(
    2,
    "Tiffany",
    "Smith",
    '2009-08-16',
    "imtiffany@comcast.net"
),
(
    2,
    "Kim",
    "Lee",
    '2008-07-11',
    "lee_k@msn.com"
);

INSERT INTO Students_Classes (
    class_id,
    student_id
)
VALUES
(
    1,
    3
),
(
    2,
    1
),
(
    3,
    5
),
(
    4,
    1
),
(
    5,
    2
);

SET FOREIGN_KEY_CHECKS=1;
COMMIT;