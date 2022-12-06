-- -------------------------------------------------------------------------
-- Schools
-- Get all school names for dropdown when creating new teacher or student
SELECT * FROM Schools

-- Get schools based on school_name filter
SELECT * FROM Schools WHERE school_name LIKE :snameInput

-- Get school names for drop down menu

SELECT * FROM Schools WHERE school_id = :school_id_input

-- Add new school
INSERT INTO Schools (school_name) VALUES (:snameInput)

-- Delete school
DELETE FROM Schools WHERE school_id = :school_id_input_from_form

-- -------------------------------------------------------------------------
-- Teachers

-- Get all teacher data to display on Teachers.html
SELECT * FROM Teachers

-- Get teachers based on last_name filter
SELECT * FROM Teachers WHERE last_name LIKE :lname_input

-- Get teacher names for drop down menu
SELECT * FROM Teachers WHERE teacher_id = :teacher_id_input

-- Edit teacher details
UPDATE Teachers
SET
school_id = :school_id_input_from_form,
WHERE Teachers.teacher_id = :teacher_id_input_from_form

-- Add new teacher
INSERT INTO Teachers (school_id, first_name, last_name, date_of_birth, email)
VALUES (:school_id_input_from_form, fname_input, lname_input, dob_input, email_input)

-- Delete teacher
DELETE FROM Teachers WHERE teacher_id = :teacher_id_input_from_form

-- -------------------------------------------------------------------------
-- Students
-- Get all student data to display on Student.html
SELECT * FROM Students

-- Get students based on last_name filter
SELECT * FROM Students WHERE last_name LIKE :lname_input

-- Edit student details
UPDATE Students
SET
school_id = :school_id_input_from_form
WHERE Students.student_id = :student_id_input_from_form

-- Add new student
INSERT INTO Students (school_id, first_name, last_name, date_of_birth, email)
VALUES (:school_id_input_from_form, fname_input, lname_input, dob_input, email_input)

-- Delete a student
DELETE FROM Students WHERE student_id = :student_id_input_from_form

-- -------------------------------------------------------------------------
-- Classes

-- Get all class data for Classes.html
SELECT * FROM Classes

-- Get classes based on class_name filter
SELECT * FROM Classes WHERE class_name LIKE :cname_input

-- Edit class details
UPDATE Classes
SET
teacher_id = :teacher_id_input_from_form
WHERE Classes.class_id = :class_id_input_from_form

-- Add new class
INSERT INTO Classes (teacher_id, class_name, class_section, max_students)
VALUES (:teacher_id_input_from_form, :cname_input, :csection_input, :max_students_input)

-- Delete a class
DELETE FROM Classes WHERE class_id = :class_id_input_from_form


-- -------------------------------------------------------------------------
-- Select all data from Students_Classes to display on html page
SELECT * FROM Students_Classes

-- Select data based on student last name filter
SELECT Students_Classes.class_id, Students_Classes.student_id FROM Students_Classes INNER JOIN Students WHERE Students_Classes.student_id = Students.student_id AND Students.last_name LIKE :last_name_input

-- Select data based on class name filter
SELECT Students_Classes.class_id, Students_Classes.student_id FROM Students_Classes INNER JOIN Classes WHERE Students_Classes.class_id = Classes.class_id AND Classes.class_name LIKE :class_name_input

-- Add student to class (M-to-M relationship addition)
INSERT INTO Students_Classes (class_id, student_id)
VALUES (:class_id_input_from_form, student_id_input_from_form)

-- Remove a student from a class (M-to-M relationship deletion)
DELETE FROM Students_Classes WHERE student_id = :student_id_input_from_form AND class_id = :class_id_input_from_form