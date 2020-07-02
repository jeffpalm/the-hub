UPDATE users
SET activation = null
WHERE id = $1;

DELETE FROM email_activation
WHERE user_id = $1;

UPDATE
  user_modification_log
SET
  user_id = '84d5fc61-90f1-4d5e-a2d3-cb8ea7433ac2'
WHERE
  user_id = $1;

UPDATE
  user_modification_log
SET
  modified_by = '84d5fc61-90f1-4d5e-a2d3-cb8ea7433ac2'
WHERE
  modified_by = $1;

UPDATE
  "tickets"
SET
  sales_id = '84d5fc61-90f1-4d5e-a2d3-cb8ea7433ac2'
WHERE
  sales_id = $1;

UPDATE
  "tickets"
SET
  manager_id = '84d5fc61-90f1-4d5e-a2d3-cb8ea7433ac2'
WHERE
  manager_id = $1;

UPDATE
  "ticket_assignment"
SET
  assigned_to = '84d5fc61-90f1-4d5e-a2d3-cb8ea7433ac2'
WHERE
  assigned_to = $1;

UPDATE
  "ticket_activity"
SET
  user_id = '84d5fc61-90f1-4d5e-a2d3-cb8ea7433ac2'
WHERE
  user_id = $1;

DELETE FROM users
WHERE id = $1;