ALTER TABLE class_tvms
DROP COLUMN room,
DROP COLUMN branch,
DROP COLUMN class_schedule_id,
ADD COLUMN location_id BIGINT,
ADD COLUMN class_name VARCHAR(255),
ADD FOREIGN KEY (location_id) REFERENCES location (id);

CREATE TABLE
    class_student (
        class_id BIGINT NOT NULL,
        student_id BIGINT NOT NULL
    );

create TABLE
    class_class_schedule (
        class_id BIGINT NOT NULL,
        schedule_id BIGINT NOT NULL
    );

ALTER TABLE class_student ADD CONSTRAINT fk_class_student_class FOREIGN KEY (class_id) REFERENCES class_tvms (id),
ADD CONSTRAINT fk_class_student_student FOREIGN KEY (student_id) REFERENCES student (id);

ALTER TABLE class_class_schedule ADD CONSTRAINT fk_class_schedule_class FOREIGN KEY (class_id) REFERENCES class_tvms (id),
ADD CONSTRAINT fk_class_schedule_schedule FOREIGN KEY (schedule_id) REFERENCES class_schedule (id);