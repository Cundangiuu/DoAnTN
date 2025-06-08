ALTER TABLE class_schedule
ADD COLUMN day_of_week VARCHAR(16) NOT NULL;

ALTER TABLE class_schedule
ADD COLUMN start_time TIME NOT NULL;

ALTER TABLE class_schedule
ADD COLUMN end_time TIME NOT NULL;

ALTER TABLE class_schedule ADD CONSTRAINT check_time_range CHECK (start_time < end_time);

CREATE TABLE
    location (
        id SERIAL PRIMARY KEY,
        branch VARCHAR NOT NULL,
        room VARCHAR NOT NULL,
        code VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_by VARCHAR(255),
        updated_by VARCHAR(255),
        is_delete BOOLEAN default false
    );

CREATE TABLE
    location_class_schedule (
        location_id int NOT NULL,
        class_schedule_id int NOT NULL
    );

ALTER TABLE location ADD CONSTRAINT unique_location_code UNIQUE (code);

ALTER TABLE location_class_schedule ADD PRIMARY KEY (location_id, class_schedule_id),
ADD FOREIGN KEY (location_id) REFERENCES location (id),
ADD FOREIGN KEY (class_schedule_id) REFERENCES class_schedule (id);