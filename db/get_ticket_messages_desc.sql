SELECT
  ta.id,
  ta.ticket_id,
  ta.action,
  ta.activity,
  ta.activity_id,
  ta.current,
  ta.previous,
  ta.logged,
  ta.private,
  ta.user_id,
  u.name AS USER
FROM
  ticket_activity ta
  JOIN users u ON ta.user_id = u.id
WHERE
  ticket_id = $1
ORDER BY
  logged DESC;