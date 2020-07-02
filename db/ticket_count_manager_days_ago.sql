SELECT
  date_trunc('day', created) AS created,
  COUNT(*) AS tickets
FROM
  all_tickets
WHERE
  manager_id = $1
GROUP BY
  created;