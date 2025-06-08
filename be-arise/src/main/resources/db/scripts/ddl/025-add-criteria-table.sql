CREATE TABLE
  criteria (
    id SERIAL PRIMARY KEY,
    grade_id INT NOT NULL UNIQUE,
    attitude VARCHAR(255),
    homework_completion VARCHAR(255),
    listening VARCHAR(255),
    speaking VARCHAR(255),
    reading VARCHAR(255),
    writing VARCHAR(255),
    vocabulary VARCHAR(255),
    grammar VARCHAR(255),
    progress VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    updated_by VARCHAR(255),
    is_delete BOOLEAN default false
  );

ALTER TABLE criteria ADD CONSTRAINT fk_grade_id FOREIGN KEY (grade_id) REFERENCES grade (id);