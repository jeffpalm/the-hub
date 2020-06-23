select m.created, concat(u.first, ' ', u.last) as created_by, m.private, m.message, m.edited, m.edited_by
from ticket_msgs as m
join users as u on m.created_by = u.id
where m.ticket_id = $1;