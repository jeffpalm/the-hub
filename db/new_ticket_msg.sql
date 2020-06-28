insert into ticket_msgs 
(ticket_id, created_by, private, message)
values
($1, $2, $3, $4);

update tickets set last_update = now() where id = $1;

insert into ticket_history
("ticket_id", "created_by", "type", "cur")
values
($1, $2, 'message', $4);

select m.created, concat(u.first, ' ', u.last) as created_by, m.private, m.message, m.edited, m.edited_by
from ticket_msgs as m
join users as u on m.created_by = u.id
where m.ticket_id = $1;