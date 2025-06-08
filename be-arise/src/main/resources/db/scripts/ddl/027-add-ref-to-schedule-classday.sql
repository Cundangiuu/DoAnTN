ALTER TABLE class_day
DROP COLUMN start_time,
DROP COLUMN end_time,
ADD COLUMN schedule_id BIGINT,
ADD CONSTRAINT fk_schedule_class_day FOREIGN KEY (schedule_id) REFERENCES class_schedule (id);