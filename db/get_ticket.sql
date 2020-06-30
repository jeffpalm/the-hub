SELECT
  t.id,
  tt.name AS TYPE,
  ts.name AS status,
  t.created,
  t.last_update AS updated,
  s.id AS sales_id,
  s.name AS sales_name,
  m.id AS manager_id,
  m.name AS manager_name,
  g.id AS guest_id,
  g.name AS guest_name,
  g.phone AS guest_phone,
  tix.cosigner_id,
  cox.name AS cosigner_name,
  cox.phone AS cosigner_phone,
  t.vin,
  v.year,
  v.make,
  v.model,
  v.ticket_count
FROM
  all_tickets t
  LEFT OUTER JOIN tickets tix ON t.id = tix.id
  LEFT OUTER JOIN admin_ticket_type tt ON t.type_id = tt.id
  LEFT OUTER JOIN admin_ticket_status ts ON t.status_id = ts.id
  LEFT OUTER JOIN users s ON t.sales_id = s.id
  LEFT OUTER JOIN users m ON t.manager_id = m.id
  LEFT OUTER JOIN guests g ON t.guest_id = g.id
  LEFT OUTER JOIN guests cox ON tix.cosigner_id = cox.id
  LEFT OUTER JOIN vehicles v ON t.vin = v.vin
WHERE
  tix.id = $1;