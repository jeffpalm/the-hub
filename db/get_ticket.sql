select t.id, tt.name as type, ts.name as status, t.created, t.last_update as updated, t.closed, s.id as sales_id, concat(s.first, ' ', s.last) as sales_name, m.id as manager_id, concat(m.first, ' ', m.last) as manager_name, g.id as guest_id, g.name as guest_name, g.phone as guest_phone, t.cosigner_id, t.vin, v.year, v.make, v.model, v.ticket_count
from tickets as t
join ticket_type as tt on t.ticket_type = tt.id
join ticket_status as ts on t.current_status = ts.id
join users as s on t.sales_id = s.id
join users as m on t.manager_id = m.id
join guests as g on t.guest_id = g.id
join vehicles as v on t.vin = v.vin
where t.id = $1;