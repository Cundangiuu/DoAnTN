ALTER TABLE staff
ADD COLUMN avatar_url VARCHAR(255);

ALTER TABLE staff
DROP COLUMN specialization;

ALTER TABLE staff
ADD COLUMN weekly_hours INTEGER;

ALTER TABLE staff
ADD COLUMN rates INTEGER;

ALTER TABLE staff_role
DROP COLUMN updated_at;

ALTER TABLE staff_role
DROP COLUMN updated_by;

ALTER TABLE staff_role
DROP COLUMN is_delete;

ALTER TABLE staff_role
DROP COLUMN created_at;

ALTER TABLE staff_role
DROP COLUMN created_by;

CREATE TABLE
    staff_class_schedule (
        staff_id int NOT NULL,
        class_schedule_id int NOT NULL
    );

CREATE TABLE
    staff_course (staff_id int NOT NULL, course_id int NOT NULL);

ALTER TABLE staff_class_schedule ADD PRIMARY KEY (staff_id, class_schedule_id),
ADD FOREIGN KEY (staff_id) REFERENCES staff (id),
ADD FOREIGN KEY (class_schedule_id) REFERENCES class_schedule (id);

ALTER TABLE staff_course ADD PRIMARY KEY (staff_id, course_id),
ADD FOREIGN KEY (staff_id) REFERENCES staff (id),
ADD FOREIGN KEY (course_id) REFERENCES course (id);

ALTER TABLE staff
ALTER COLUMN code
DROP NOT NULL;