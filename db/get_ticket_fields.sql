select tf.id, tf.ticket_id, tft.name as field_name, tf.content, tf.edited, tf.edited_by
from ticket_fields as tf
join ticket_field_type as tft on tf.field_type = tft.id
where tf.ticket_id = $1;