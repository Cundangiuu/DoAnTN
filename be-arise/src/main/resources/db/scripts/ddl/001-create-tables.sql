CREATE TABLE student (
  id SERIAL PRIMARY KEY,
  code VARCHAR(50) UNIQUE,
  first_name VARCHAR(50) NOT null,
  last_name VARCHAR(50) NOT NULL,
  date_of_birth DATE,
  email_address VARCHAR(100) NOT NULL,
  phone_number VARCHAR(15),
  address VARCHAR(255),
  avatar_url text,
  discount_id int,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by VARCHAR(255),
  updated_by VARCHAR(255),
  is_delete BOOLEAN default false

);


create table grade (
	id serial primary key,
    student_id int,
	class_id int,
	test_type_id int,
	speaking float,
	listening float,
	reading_writing float,
	comment text,
  	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  	created_by VARCHAR(255),
  	updated_by VARCHAR(255),
  	is_delete BOOLEAN default false
);

create table test_type(
	id serial primary key,
	type VARCHAR(250) UNIQUE,
	description text,
  	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  	created_by VARCHAR(255),
  	updated_by VARCHAR(255),
  	is_delete BOOLEAN default false
);

create table discount(
	id SERIAL PRIMARY KEY,
	type VARCHAR(50) UNIQUE,
	description text,
  	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  	created_by VARCHAR(255),
  	updated_by VARCHAR(255),
  	is_delete BOOLEAN default false
);

CREATE TABLE attendance (
  id SERIAL PRIMARY KEY,
  student_id INTEGER NOT NULL,
  class_id INTEGER NOT NULL,
  class_day_id INTEGER not null,
  date DATE NOT NULL,
  status VARCHAR(10) NOT NULL DEFAULT 'Present',
  comment text,
  home_work VARCHAR(50),
  attitude VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by VARCHAR(255),
  updated_by VARCHAR(255),
  is_delete BOOLEAN default false
);

CREATE TABLE staff (
  id SERIAL PRIMARY KEY,
  code VARCHAR(50) not null,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email_address VARCHAR(100) NOT NULL,
  phone_number VARCHAR(15),
  specialization VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by VARCHAR(255),
  updated_by VARCHAR(255),
  is_delete BOOLEAN default false
);

create table role (
	id SERIAL primary key,
	role_name VARCHAR(50) unique,
  	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  	created_by VARCHAR(255),
  	updated_by VARCHAR(255),
  	is_delete BOOLEAN default false
);

create table staff_role (
	role_id int,
	staff_id int,
  	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  	created_by VARCHAR(255),
  	updated_by VARCHAR(255),
  	is_delete BOOLEAN default false
);

CREATE TABLE course (
  id SERIAL PRIMARY KEY,
  code VARCHAR(50) not NULL,
  name VARCHAR(100) NOT NULL,
  tuition_rate int,
  number_hour int,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by VARCHAR(255),
  updated_by VARCHAR(255),
  is_delete BOOLEAN default false
);

CREATE TABLE lesson (
  id SERIAL PRIMARY KEY,
  code VARCHAR(50) not NULL,
  course_id INTEGER NOT NULL,
  number INTEGER NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by VARCHAR(255),
  updated_by VARCHAR(255),
  is_delete BOOLEAN default false
);

CREATE TABLE class_tvms (
  id SERIAL PRIMARY KEY,
  code VARCHAR(50) not null,
  course_id INTEGER NOT NULL,
  class_schedule_id INTEGER not null,
  start_date DATE,
  room VARCHAR(50),
  branch VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by VARCHAR(255),
  updated_by VARCHAR(255),
  is_delete BOOLEAN default false
);

create table class_schedule (
	id serial primary key,
	code varchar(50) unique,
	description text,
  	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  	created_by VARCHAR(255),
  	updated_by VARCHAR(255),
  	is_delete BOOLEAN default false
);

create table class_day (
    id serial primary key,
    class_id int,
    lesson_id INTEGER not null,
	class_date DATE,
    start_time TIME NOT NULL,
  	end_time TIME NOT NULL,
  	is_final boolean,
  	is_midterm boolean,
  	comment text,
  	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  	created_by VARCHAR(255),
  	updated_by VARCHAR(255),
  	is_delete BOOLEAN default false
);

create table staff_class (
	staff_id int,
	class_id int,
  	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  	created_by VARCHAR(255),
  	updated_by VARCHAR(255),
  	is_delete BOOLEAN default false
);

create table enrollment (
    id serial primary key,
    student_id int,
	  course_id int,
	  class_code VARCHAR(50),
	  enrollment_date DATE NOT NULL,
  	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  	created_by VARCHAR(255),
  	updated_by VARCHAR(255),
  	is_delete BOOLEAN default false
);

create table invoice (
	id serial primary key,
	enrollment_id int,
	amount int,
	payment_type varchar(50),
	description text,
  	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  	created_by VARCHAR(255),
  	updated_by VARCHAR(255),
  	is_delete BOOLEAN default false
);

CREATE TABLE holiday_schedule (
  id SERIAL PRIMARY KEY,
  holiday_type VARCHAR(50) NOT NULL,
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP not null,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by VARCHAR(255),
  updated_by VARCHAR(255),
  is_delete BOOLEAN default false
);

CREATE TABLE automated_report (
  id SERIAL PRIMARY KEY,
  report_type VARCHAR(50) NOT NULL,
  generated_date DATE NOT NULL,
  details TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by VARCHAR(255),
  updated_by VARCHAR(255),
  is_delete BOOLEAN default false
);

alter table student
	add foreign key (discount_id) references discount (id);

ALTER TABLE staff
  ADD CONSTRAINT unique_staff_code UNIQUE (code);

ALTER TABLE course
  ADD CONSTRAINT unique_course_code UNIQUE (code);

alter table grade
	add constraint unique_student_class unique (student_id, class_id, test_type_id);

ALTER TABLE lesson
  ADD CONSTRAINT unique_lesson_code UNIQUE (code);

ALTER TABLE class_tvms
  ADD CONSTRAINT unique_class_code UNIQUE (code);

 ALTER TABLE enrollment
  ADD CONSTRAINT fk_enrollment_student
  FOREIGN KEY (student_id) REFERENCES student(id),
  ADD CONSTRAINT fk_enrollment_course
  FOREIGN KEY (course_id) REFERENCES course (id);

 alter table staff_role
 	add primary key (staff_id, role_id),
 	add foreign key (staff_id) references staff (id),
 	add foreign key (role_id) references role (id);

 ALTER TABLE attendance
  ADD CONSTRAINT fk_attendance_student
  FOREIGN KEY (student_id) REFERENCES student (id),
  ADD CONSTRAINT fk_attendance_class
  FOREIGN KEY (class_id) REFERENCES class_tvms (id),
  add constraint fk_attendance_class_day
  foreign key (class_day_id) references class_day (id);

 alter table staff_class
 	add primary key (staff_id, class_id),
 	add foreign key (staff_id) references staff (id),
 	add foreign key (class_id) references class_tvms (id);

ALTER TABLE lesson
  ADD CONSTRAINT fk_lesson_course
  FOREIGN KEY (course_id) REFERENCES course(id);

ALTER TABLE class_tvms
  ADD CONSTRAINT fk_class_course
  FOREIGN KEY (course_id) REFERENCES course(id),
  add CONSTRAINT fk_class_class_schedule
  foreign key (class_schedule_id) references class_schedule(id);

 alter table class_day
 	add foreign key (class_id) references class_tvms (id),
 	add foreign key (lesson_id) references lesson (id),
    add constraint unique_class_lesson unique (class_id, lesson_id);

alter table grade
 	add foreign key (class_id) references class_tvms (id),
 	add foreign key (student_id) references student (id),
    add foreign key (test_type_id) references test_type (id),
    add constraint unique_grade unique (class_id, student_id, test_type_id);

alter table invoice
	add foreign key (enrollment_id) references enrollment (id);