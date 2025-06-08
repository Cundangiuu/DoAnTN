UPDATE test_type
SET
  type = 'FINAL'
WHERE
  type = 'FINALTERM';

UPDATE test_type
SET
  type = 'COURSE'
WHERE
  type = 'RESULT';