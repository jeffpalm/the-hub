SELECT
  id,
  email,
  name,
  phone,
  role,
  available,
  reset_count,
  require_reset,
  created,
  last_reset,
  last_visit
FROM
  users
WHERE
  role = $1;