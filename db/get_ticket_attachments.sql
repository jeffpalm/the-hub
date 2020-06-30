SELECT
  ta.id,
  ta.ticket_id,
  tat.name AS "type",
  tat.description,
  ta.filepath
FROM
  ticket_attachments AS ta
  JOIN admin_attachment_type AS tat ON ta.type = tat.id
WHERE
  ta.ticket_id = $1;