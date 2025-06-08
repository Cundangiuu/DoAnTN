alter table enrollment drop column class_code;

alter table enrollment add column class_tvms_id int;

alter table enrollment add constraint fk_enrollment_class_tvms foreign key (class_tvms_id) references class_tvms(id);