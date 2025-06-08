CREATE TABLE
  skill (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    score FLOAT,
    grade_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    updated_by VARCHAR(255),
    is_delete BOOLEAN DEFAULT FALSE
  );

CREATE TABLE
  formula (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    midterm_listening_max_score FLOAT,
    midterm_speaking_max_score FLOAT,
    midterm_reading_max_score FLOAT,
    midterm_writing_max_score FLOAT,
    midterm_sum_formula TEXT,
    midterm_percentage_formula TEXT,
    midterm_classification_formula TEXT,
    final_listening_max_score FLOAT,
    final_speaking_max_score FLOAT,
    final_reading_max_score FLOAT,
    final_writing_max_score FLOAT,
    final_sum_formula TEXT,
    final_percentage_formula TEXT,
    final_classification_formula TEXT,
    midterm_grade_weight FLOAT,
    final_grade_weight FLOAT,
    bonus_grade_weight FLOAT,
    classification_formula TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    updated_by VARCHAR(255),
    is_delete BOOLEAN DEFAULT FALSE
  );

ALTER TABLE skill ADD CONSTRAINT fk_skill_grade_id FOREIGN KEY (grade_id) REFERENCES grade (id);

ALTER TABLE grade
DROP COLUMN speaking,
DROP COLUMN listening,
DROP COLUMN reading_writing;

ALTER TABLE grade
ADD COLUMN classification VARCHAR(255),
ADD COLUMN score FLOAT;

ALTER TABLE course
ADD COLUMN formula_id INTEGER;

ALTER TABLE course ADD CONSTRAINT fk_course_formula_id FOREIGN KEY (formula_id) REFERENCES formula (id);