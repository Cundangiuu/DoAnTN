alter table enrollment drop column class_code;

alter table enrollment add column class_arise_id int;

alter table enrollment add constraint fk_enrollment_class_arise foreign key (class_arise_id) references class_arise(id);