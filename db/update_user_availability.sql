UPDATE
  users
SET
  available = $2
WHERE
  id = $1
RETURNING available;