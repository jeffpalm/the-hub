insert into guests (name, phone, sales_id, created_by) values ('Wolfie Tulk', '5575502818', 2, 2);
insert into guests (name, phone, sales_id, created_by) values ('Willabella Chadband', '8866554346', 2, 2);
insert into guests (name, phone, sales_id, created_by) values ('Candace Botley', '5415905041', 2, 2);
insert into guests (name, phone, sales_id, created_by) values ('Edi Lashford', '7058980673', 2, 2);
insert into guests (name, phone, sales_id, created_by) values ('Tedi Crothers', '4171901008', 2, 2);

insert into vehicles (vin) values ('4T3BA3BB9FU285808');
insert into vehicles (vin) values ('WAUVT58E43A044007');
insert into vehicles (vin) values ('ZHWGU5BZ9CL671267');
insert into vehicles (vin) values ('19UYA41723A059635');
insert into vehicles (vin) values ('WBAXH5C58CD755922');

insert into tickets (guest_id, cosigner_id, sales_id, manager_id, ticket_type, current_status, vin, showroom, appointment) values (7, null, 2, 1, 3, 1, '4T3BA3BB9FU285808', true, null);
insert into tickets (guest_id, cosigner_id, sales_id, manager_id, ticket_type, current_status, vin, showroom, appointment) values (8, 11, 2, 1, 1, 1, 'WAUVT58E43A044007', true, '2020-06-24T22:05:42Z');
insert into tickets (guest_id, cosigner_id, sales_id, manager_id, ticket_type, current_status, vin, showroom, appointment) values (9, null, 2, 1, 1, 1, 'ZHWGU5BZ9CL671267', true, null);
insert into tickets (guest_id, cosigner_id, sales_id, manager_id, ticket_type, current_status, vin, showroom, appointment) values (10, null, 2, 1, 2, 1, '19UYA41723A059635', true, null);
insert into tickets (guest_id, cosigner_id, sales_id, manager_id, ticket_type, current_status, vin, showroom, appointment) values (11, null, 2, 1, 1, 1, 'WBAXH5C58CD755922', false, null);