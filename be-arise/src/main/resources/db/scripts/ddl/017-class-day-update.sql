ALTER TABLE class_tvms
DROP COLUMN location_id,
ADD COLUMN staff_id BIGINT;

ALTER TABLE class_day
ADD COLUMN teacher_id BIGINT,
ADD COLUMN location_id BIGINT;

ALTER TABLE class_day ADD CONSTRAINT fk_class_day_teacher FOREIGN KEY (teacher_id) REFERENCES staff (id),
ADD CONSTRAINT fk_class_day_location FOREIGN KEY (location_id) REFERENCES location (id);

ALTER TABLE class_tvms ADD CONSTRAINT fk_class_staff FOREIGN KEY (staff_id) REFERENCES staff (id);