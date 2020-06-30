WITH new_message AS (
  INSERT INTO
    ticket_messages (ticket_id, "private", message)
  VALUES
    ($1, $3, $4) RETURNING *
)
INSERT INTO
  ticket_activity (
    "ticket_id",
    "user_id",
    "activity",
    "private",
    "current",
    "action",
    "activity_id"
  )
VALUES
  (
    $1,
    $2,
    'message',
    $3,
    $4,
    'created',
    (
      SELECT
        id
      FROM
        new_message
    )
  );

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
  logged;