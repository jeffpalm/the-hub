select ta.id, tat.name, ta.filepath, ta.guest_id, ta.ticket_id, ta.created, concat(u.first, ' ', u.last) as created_by
from ticket_attachments as ta
join ticket_attachment_type as tat on ta.type = tat.id
join users as u on ta.created_by = u.id
where ta.ticket_id = $1;