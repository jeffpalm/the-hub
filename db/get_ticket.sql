select 
  t.id,
  tt.name as type,
  ts.name as status,
  t.created,
  t.last_update as updated,
  t.closed, s.id as sales_id,
  concat(s.first, ' ', s.last) as sales_name,
  m.id as manager_id,
  concat(m.first, ' ', m.last) as manager_name,
  g.id as guest_id,
  g.name as guest_name,
  g.phone as guest_phone,
  t.cosigner_id,
  cox.name as cosigner_name,
  cox.phone as cosigner_phone,
  t.vin,
  v.year,
  v.make,
  v.model,
  v.ticket_count
from tickets t
left outer join ticket_type tt on t.ticket_type = tt.id
left outer join ticket_status ts on t.current_status = ts.id
left outer join users s on t.sales_id = s.id
left outer join users m on t.manager_id = m.id
left outer join guests g on t.guest_id = g.id
left outer join guests cox on t.cosigner_id = cox.id
left outer join vehicles v on t.vin = v.vin
where t.id = $1;