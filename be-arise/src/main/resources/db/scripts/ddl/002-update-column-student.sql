ALTER TABLE student
RENAME COLUMN first_name TO name;

ALTER TABLE student
RENAME COLUMN last_name TO nickname;

ALTER TABLE student
ALTER COLUMN nickname
DROP NOT NULL;