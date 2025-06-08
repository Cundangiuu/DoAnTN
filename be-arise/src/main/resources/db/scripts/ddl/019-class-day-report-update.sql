ALTER TABLE lesson
ADD COLUMN lesson_type_id BIGINT,
ADD CONSTRAINT fk_lesson_test_type FOREIGN KEY (lesson_type_id) REFERENCES test_type (id);