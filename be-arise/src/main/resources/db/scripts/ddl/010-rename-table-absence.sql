ALTER TABLE attendance RENAME TO absence;

ALTER TABLE absence
DROP COLUMN date,
DROP COLUMN status,
DROP COLUMN comment,
DROP COLUMN home_work,
DROP COLUMN attitude;

ALTER TABLE absence ADD COLUMN is_absent BOOLEAN;
