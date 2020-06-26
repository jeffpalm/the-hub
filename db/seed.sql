DROP TABLE IF EXISTS "users" CASCADE;
DROP TABLE IF EXISTS "user_group" CASCADE;
DROP TABLE IF EXISTS "user_history" CASCADE;
DROP TABLE IF EXISTS "guests" CASCADE;
DROP TABLE IF EXISTS "guest_notes" CASCADE;
DROP TABLE IF EXISTS "guest_relationship" CASCADE;
DROP TABLE IF EXISTS "tickets" CASCADE;
DROP TABLE IF EXISTS "ticket_fields" CASCADE;
DROP TABLE IF EXISTS "ticket_settings_active" CASCADE;
DROP TABLE IF EXISTS "ticket_setting_history" CASCADE;
DROP TABLE IF EXISTS "ticket_settings" CASCADE;
DROP TABLE IF EXISTS "ticket_setting_values" CASCADE;
DROP TABLE IF EXISTS "ticket_type" CASCADE;
DROP TABLE IF EXISTS "ticket_status" CASCADE;
DROP TABLE IF EXISTS "ticket_msgs" CASCADE;
DROP TABLE IF EXISTS "ticket_history" CASCADE;
DROP TABLE IF EXISTS "ticket_field_type" CASCADE;
DROP TABLE IF EXISTS "ticket_attachments" CASCADE;
DROP TABLE IF EXISTS "ticket_attachment_type" CASCADE;
DROP TABLE IF EXISTS "deliveries" CASCADE;
DROP TABLE IF EXISTS "delivery_queues" CASCADE;
DROP TABLE IF EXISTS "delivery_queue_steps" CASCADE;
DROP TABLE IF EXISTS "delivery_notes" CASCADE;
DROP TABLE IF EXISTS "delivery_queue_type" CASCADE;
DROP TABLE IF EXISTS "delivery_queue_step_type" CASCADE;
DROP TABLE IF EXISTS "delivery_queue_step_status" CASCADE;
DROP TABLE IF EXISTS "checklist_types" CASCADE;
DROP TABLE IF EXISTS "checklist_types_items" CASCADE;
DROP TABLE IF EXISTS "checklists" CASCADE;
DROP TABLE IF EXISTS "checklist_items" CASCADE;
DROP TABLE IF EXISTS "menu_links" CASCADE;
DROP TABLE IF EXISTS "vehicles" CASCADE;
DROP TYPE IF EXISTS "ticket_history_type" CASCADE;
DROP TYPE IF EXISTS "input_types" CASCADE;
DROP TYPE IF EXISTS "deal_type" CASCADE;
DROP TYPE IF EXISTS "assignment_type" CASCADE;

CREATE TYPE "field_types" AS ENUM (
  'text',
  'number',
  'list',
  'date'
)

CREATE TYPE "ticket_history_type" AS ENUM (
  'message',
  'field',
  'status',
  'type',
  'vin',
  'showroom',
  'appointment',
  'guest',
  'cosigner',
  'sales',
  'manager'
);

CREATE TYPE "input_types" AS ENUM (
  'checkbox',
  'text'
);

CREATE TYPE "deal_type" AS ENUM (
  'finance',
  'cash',
  'osf'
);

CREATE TYPE "assignment_type" AS ENUM (
  'manual',
  'round_robin',
  'load_balanced_round_robin'
);

CREATE TABLE "users" (
  "id" serial PRIMARY KEY,
  "email" text,
  "password" text,
  "first" varchar(50),
  "last" varchar(50),
  "phone" varchar(10) UNIQUE,
  "reset_count" int,
  "require_reset" bool DEFAULT true,
  "created" timestamptz(2) DEFAULT (now()),
  "created_by" int,
  "last_reset" timestamptz(2),
  "last_visit" timestamptz(2),
  "user_group" int,
  "available" bool DEFAULT false,
  "activation" text
);

CREATE TABLE "user_group" (
  "id" serial PRIMARY KEY,
  "name" varchar(50),
  "manager" bool,
  "admin" bool,
  "support" bool,
  "support_manager" bool
);

CREATE TABLE "user_history" (
  "id" serial PRIMARY KEY,
  "user_id" int,
  "endpoint" varchar(500),
  "request" json,
  "response" json,
  "time_stamp" timestamptz(2) DEFAULT (now())
);

CREATE TABLE "guests" (
  "id" serial PRIMARY KEY,
  "name" varchar(100),
  "phone" varchar(10) UNIQUE,
  "sales_id" int,
  "created" timestamptz(2) DEFAULT (now()),
  "created_by" int,
  "edited" timestamptz(2) DEFAULT null,
  "edited_by" int DEFAULT null
);

CREATE TABLE "guest_notes" (
  "id" serial PRIMARY KEY,
  "guest_id" int,
  "content" varchar(1000),
  "created" timestamptz(2) DEFAULT (now()),
  "created_by" int
);

CREATE TABLE "guest_relationship" (
  "id" serial PRIMARY KEY,
  "guest_one" int,
  "guest_two" int,
  "relationship" varchar(100),
  "note" varchar(1000),
  "created" timestamptz(2) DEFAULT (now()),
  "created_by" int
);

CREATE TABLE "tickets" (
  "id" serial PRIMARY KEY,
  "guest_id" int,
  "cosigner_id" int,
  "sales_id" int,
  "manager_id" int,
  "ticket_type" int,
  "current_status" int,
  "vin" varchar(17),
  "showroom" bool,
  "appointment" timestamptz(2),
  "created" timestamptz(2) DEFAULT (now()),
  "created_by" int,
  "accepted" timestamptz(2) DEFAULT null,
  "closed" timestamptz(2),
  "last_update" timestamptz(2)
);

CREATE TABLE "ticket_fields" (
  "id" serial PRIMARY KEY,
  "ticket_id" int,
  "field_type" int,
  "content" text,
  "edited" timestamptz(2) DEFAULT null,
  "edited_by" int DEFAULT null
);

CREATE TABLE "ticket_settings_active" (
  "id" serial PRIMARY KEY,
  "setting" int UNIQUE,
  "value" int
);

CREATE TABLE "ticket_setting_history" (
  "id" serial PRIMARY KEY,
  "setting" int,
  "from" int,
  "to" int,
  "created" timestamptz(2) DEFAULT (now()),
  "created_by" int
);

CREATE TABLE "ticket_settings" (
  "id" serial PRIMARY KEY,
  "name" varchar(100) UNIQUE,
  "description" varchar(500)
);

CREATE TABLE "ticket_setting_values" (
  "id" serial PRIMARY KEY,
  "setting_id" int,
  "value" varchar(100),
  "description" varchar(500)
);

CREATE TABLE "ticket_type" (
  "id" serial PRIMARY KEY,
  "name" varchar(50),
  "created" timestamptz(2) DEFAULT (now()),
  "created_by" int
);

CREATE TABLE "ticket_status" (
  "id" serial PRIMARY KEY,
  "ticket_type" int,
  "name" varchar(50),
  "new_ticket" bool,
  "accepted" bool,
  "active" bool,
  "delivery_ready" bool,
  "closed" bool,
  "created" timestamptz(2) DEFAULT (now()),
  "created_by" int
);

CREATE TABLE "ticket_msgs" (
  "id" serial PRIMARY KEY,
  "ticket_id" int,
  "private" bool,
  "message" text,
  "created" timestamptz(2) DEFAULT (now()),
  "created_by" int,
  "edited" timestamptz(2) DEFAULT null,
  "edited_by" int DEFAULT null
);

CREATE TABLE "ticket_history" (
  "id" serial PRIMARY KEY,
  "ticket_id" int,
  "type" ticket_history_type,
  "from" varchar(100),
  "to" varchar(100),
  "created" timestamptz(2) DEFAULT (now()),
  "created_by" int
);

CREATE TABLE "ticket_field_type" (
  "id" serial PRIMARY KEY,
  "name" varchar(50),
  "description" varchar(500),
  "field_type" field_type,
  "is_validated" boolean,
  "select_multiple" boolean,
  "required" boolean,
  "valid_options" text[],
  "default_option" text,
  "regex" text,
  "ticket_type" int DEFAULT 0,
  "created" timestamptz(2) DEFAULT (now()),
  "created_by" int
);

CREATE TABLE "ticket_attachments" (
  "id" serial PRIMARY KEY,
  "type" int,
  "guest_id" int,
  "ticket_id" int,
  "filepath" varchar(500),
  "created" timestamptz(2) DEFAULT (now()),
  "created_by" int
);

CREATE TABLE "ticket_attachment_type" (
  "id" serial PRIMARY KEY,
  "name" varchar(50),
  "ticket_type" int DEFAULT 0,
  "created" timestamptz(2) DEFAULT (now()),
  "created_by" int
);

CREATE TABLE "deliveries" (
  "id" serial PRIMARY KEY,
  "ticket_id" int,
  "delivery_time" timestamptz(2) DEFAULT null,
  "in_showroom" bool,
  "created" timestamptz(2) DEFAULT (now()),
  "started" timestamptz(2),
  "completed" timestamptz(2)
);

CREATE TABLE "delivery_queues" (
  "id" serial PRIMARY KEY,
  "delivery_id" int,
  "current_step" int DEFAULT 1,
  "queue_id" int,
  "support_id" int,
  "checklist_id" int DEFAULT 0,
  "created" timestamptz(2) DEFAULT (now()),
  "started" timestamptz(2),
  "updated" timestamptz(2),
  "completed" timestamptz(2)
);

CREATE TABLE "delivery_queue_steps" (
  "id" serial PRIMARY KEY,
  "delivery_id" int,
  "task_id" int,
  "assigned_to" int,
  "status" int,
  "created" timestamptz(2) DEFAULT (now()),
  "started" timestamptz(2),
  "completed" timestamptz(2)
);

CREATE TABLE "delivery_notes" (
  "id" serial PRIMARY KEY,
  "delivery_id" int,
  "task_id" int,
  "step_id" int,
  "note" text,
  "created" timestamptz(2) DEFAULT (now()),
  "created_by" int
);

CREATE TABLE "delivery_queue_type" (
  "id" serial PRIMARY KEY,
  "queue_name" varchar(50) UNIQUE,
  "description" varchar(1000),
  "ticket_type" int DEFAULT 0,
  "ticket_status" int,
  "user_group" int,
  "support_group" int,
  "manager_group" int,
  "assignment_type" assignment_type
);

CREATE TABLE "delivery_queue_step_type" (
  "id" serial PRIMARY KEY,
  "step_num" int,
  "step_name" varchar(100),
  "step_description" varchar(500),
  "queue_id" int,
  "created" timestamptz(2) DEFAULT (now()),
  "created_by" int
);

CREATE TABLE "delivery_queue_step_status" (
  "id" serial PRIMARY KEY,
  "status_name" varchar(50) UNIQUE,
  "step_id" int,
  "created" timestamptz(2) DEFAULT (now()),
  "created_by" int
);

CREATE TABLE "checklist_types" (
  "id" serial PRIMARY KEY,
  "user_group" int,
  "deal_type" deal_type,
  "with_trade" bool,
  "created" timestamptz(2) DEFAULT (now()),
  "created_by" int
);

CREATE TABLE "checklist_types_items" (
  "id" serial PRIMARY KEY,
  "checklist_type" int,
  "name" varchar(100),
  "description" varchar(2000),
  "input_type" input_types,
  "attachment_allowed" bool,
  "attachment_required" bool,
  "created" timestamptz(2) DEFAULT (now()),
  "created_by" int
);

CREATE TABLE "checklists" (
  "id" serial PRIMARY KEY,
  "ticket_id" int,
  "checklist_type" int,
  "assigned_to" int,
  "note" text,
  "created" timestamptz(2) DEFAULT (now()),
  "accepted" timestamptz(2),
  "completed" timestamptz(2)
);

CREATE TABLE "checklist_items" (
  "id" serial PRIMARY KEY,
  "checklist_id" int,
  "item_id" int,
  "input" text,
  "attachment_id" int,
  "completed" timestamptz(2) DEFAULT (now())
);

CREATE TABLE "menu_links" (
  "id" serial PRIMARY KEY,
  "user_group" int,
  "link_text" varchar(30),
  "url" varchar(2000),
  "order" int
);

CREATE TABLE "vehicles" (
  "vin" varchar(17) UNIQUE,
  "year" int,
  "make" varchar(100),
  "model" varchar(100),
  "trim" varchar(100),
  "color" varchar(100),
  "ticket_count" int
);

ALTER TABLE "users" ADD FOREIGN KEY ("created_by") REFERENCES "users" ("id");

ALTER TABLE "users" ADD FOREIGN KEY ("user_group") REFERENCES "user_group" ("id");

ALTER TABLE "user_history" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "guests" ADD FOREIGN KEY ("sales_id") REFERENCES "users" ("id");

ALTER TABLE "guests" ADD FOREIGN KEY ("created_by") REFERENCES "users" ("id");

ALTER TABLE "guests" ADD FOREIGN KEY ("edited_by") REFERENCES "users" ("id");

ALTER TABLE "guest_notes" ADD FOREIGN KEY ("guest_id") REFERENCES "guests" ("id");

ALTER TABLE "guest_notes" ADD FOREIGN KEY ("created_by") REFERENCES "users" ("id");

ALTER TABLE "guest_relationship" ADD FOREIGN KEY ("guest_one") REFERENCES "guests" ("id");

ALTER TABLE "guest_relationship" ADD FOREIGN KEY ("guest_two") REFERENCES "guests" ("id");

ALTER TABLE "guest_relationship" ADD FOREIGN KEY ("created_by") REFERENCES "users" ("id");

ALTER TABLE "tickets" ADD FOREIGN KEY ("guest_id") REFERENCES "guests" ("id");

ALTER TABLE "tickets" ADD FOREIGN KEY ("cosigner_id") REFERENCES "guests" ("id");

ALTER TABLE "tickets" ADD FOREIGN KEY ("sales_id") REFERENCES "users" ("id");

ALTER TABLE "tickets" ADD FOREIGN KEY ("manager_id") REFERENCES "users" ("id");

ALTER TABLE "tickets" ADD FOREIGN KEY ("ticket_type") REFERENCES "ticket_type" ("id");

ALTER TABLE "tickets" ADD FOREIGN KEY ("current_status") REFERENCES "ticket_status" ("id");

ALTER TABLE "tickets" ADD FOREIGN KEY ("vin") REFERENCES "vehicles" ("vin");

ALTER TABLE "tickets" ADD FOREIGN KEY ("created_by") REFERENCES "users" ("id");

ALTER TABLE "ticket_fields" ADD FOREIGN KEY ("ticket_id") REFERENCES "tickets" ("id");

ALTER TABLE "ticket_fields" ADD FOREIGN KEY ("field_type") REFERENCES "ticket_field_type" ("id");

ALTER TABLE "ticket_fields" ADD FOREIGN KEY ("edited_by") REFERENCES "users" ("id");

ALTER TABLE "ticket_settings_active" ADD FOREIGN KEY ("setting") REFERENCES "ticket_settings" ("id");

ALTER TABLE "ticket_settings_active" ADD FOREIGN KEY ("value") REFERENCES "ticket_setting_values" ("id");

ALTER TABLE "ticket_setting_history" ADD FOREIGN KEY ("setting") REFERENCES "ticket_settings" ("id");

ALTER TABLE "ticket_setting_history" ADD FOREIGN KEY ("from") REFERENCES "ticket_setting_values" ("id");

ALTER TABLE "ticket_setting_history" ADD FOREIGN KEY ("to") REFERENCES "ticket_setting_values" ("id");

ALTER TABLE "ticket_setting_history" ADD FOREIGN KEY ("created_by") REFERENCES "users" ("id");

ALTER TABLE "ticket_setting_values" ADD FOREIGN KEY ("setting_id") REFERENCES "ticket_settings" ("id");

ALTER TABLE "ticket_type" ADD FOREIGN KEY ("created_by") REFERENCES "users" ("id");

ALTER TABLE "ticket_status" ADD FOREIGN KEY ("ticket_type") REFERENCES "ticket_type" ("id");

ALTER TABLE "ticket_status" ADD FOREIGN KEY ("created_by") REFERENCES "users" ("id");

ALTER TABLE "ticket_msgs" ADD FOREIGN KEY ("ticket_id") REFERENCES "tickets" ("id");

ALTER TABLE "ticket_msgs" ADD FOREIGN KEY ("created_by") REFERENCES "users" ("id");

ALTER TABLE "ticket_msgs" ADD FOREIGN KEY ("edited_by") REFERENCES "users" ("id");

ALTER TABLE "ticket_history" ADD FOREIGN KEY ("ticket_id") REFERENCES "tickets" ("id");

ALTER TABLE "ticket_history" ADD FOREIGN KEY ("created_by") REFERENCES "users" ("id");

ALTER TABLE "ticket_field_type" ADD FOREIGN KEY ("ticket_type") REFERENCES "ticket_type" ("id");

ALTER TABLE "ticket_field_type" ADD FOREIGN KEY ("created_by") REFERENCES "users" ("id");

ALTER TABLE "ticket_attachments" ADD FOREIGN KEY ("type") REFERENCES "ticket_attachment_type" ("id");

ALTER TABLE "ticket_attachments" ADD FOREIGN KEY ("guest_id") REFERENCES "guests" ("id");

ALTER TABLE "ticket_attachments" ADD FOREIGN KEY ("ticket_id") REFERENCES "tickets" ("id");

ALTER TABLE "ticket_attachments" ADD FOREIGN KEY ("created_by") REFERENCES "users" ("id");

ALTER TABLE "ticket_attachment_type" ADD FOREIGN KEY ("ticket_type") REFERENCES "ticket_type" ("id");

ALTER TABLE "ticket_attachment_type" ADD FOREIGN KEY ("created_by") REFERENCES "users" ("id");

ALTER TABLE "deliveries" ADD FOREIGN KEY ("ticket_id") REFERENCES "tickets" ("id");

ALTER TABLE "delivery_queues" ADD FOREIGN KEY ("delivery_id") REFERENCES "deliveries" ("id");

ALTER TABLE "delivery_queues" ADD FOREIGN KEY ("queue_id") REFERENCES "delivery_queue_type" ("id");

ALTER TABLE "delivery_queues" ADD FOREIGN KEY ("support_id") REFERENCES "users" ("id");

ALTER TABLE "delivery_queues" ADD FOREIGN KEY ("checklist_id") REFERENCES "checklist_types" ("id");

ALTER TABLE "delivery_queue_steps" ADD FOREIGN KEY ("delivery_id") REFERENCES "deliveries" ("id");

ALTER TABLE "delivery_queue_steps" ADD FOREIGN KEY ("task_id") REFERENCES "delivery_queue_type" ("id");

ALTER TABLE "delivery_queue_steps" ADD FOREIGN KEY ("assigned_to") REFERENCES "users" ("id");

ALTER TABLE "delivery_queue_steps" ADD FOREIGN KEY ("status") REFERENCES "delivery_queue_step_status" ("id");

ALTER TABLE "delivery_notes" ADD FOREIGN KEY ("delivery_id") REFERENCES "deliveries" ("id");

ALTER TABLE "delivery_notes" ADD FOREIGN KEY ("task_id") REFERENCES "delivery_queue_type" ("id");

ALTER TABLE "delivery_notes" ADD FOREIGN KEY ("step_id") REFERENCES "delivery_queue_steps" ("id");

ALTER TABLE "delivery_notes" ADD FOREIGN KEY ("created_by") REFERENCES "users" ("id");

ALTER TABLE "delivery_queue_type" ADD FOREIGN KEY ("ticket_type") REFERENCES "ticket_type" ("id");

ALTER TABLE "delivery_queue_type" ADD FOREIGN KEY ("ticket_status") REFERENCES "ticket_settings" ("id");

ALTER TABLE "delivery_queue_type" ADD FOREIGN KEY ("user_group") REFERENCES "user_group" ("id");

ALTER TABLE "delivery_queue_type" ADD FOREIGN KEY ("support_group") REFERENCES "user_group" ("id");

ALTER TABLE "delivery_queue_type" ADD FOREIGN KEY ("manager_group") REFERENCES "user_group" ("id");

ALTER TABLE "delivery_queue_step_type" ADD FOREIGN KEY ("queue_id") REFERENCES "delivery_queue_type" ("id");

ALTER TABLE "delivery_queue_step_type" ADD FOREIGN KEY ("created_by") REFERENCES "users" ("id");

ALTER TABLE "delivery_queue_step_status" ADD FOREIGN KEY ("step_id") REFERENCES "delivery_queue_steps" ("id");

ALTER TABLE "delivery_queue_step_status" ADD FOREIGN KEY ("created_by") REFERENCES "users" ("id");

ALTER TABLE "checklist_types" ADD FOREIGN KEY ("user_group") REFERENCES "user_group" ("id");

ALTER TABLE "checklist_types" ADD FOREIGN KEY ("created_by") REFERENCES "users" ("id");

ALTER TABLE "checklist_types_items" ADD FOREIGN KEY ("checklist_type") REFERENCES "checklist_types" ("id");

ALTER TABLE "checklist_types_items" ADD FOREIGN KEY ("created_by") REFERENCES "users" ("id");

ALTER TABLE "checklists" ADD FOREIGN KEY ("ticket_id") REFERENCES "tickets" ("id");

ALTER TABLE "checklists" ADD FOREIGN KEY ("checklist_type") REFERENCES "checklist_types_items" ("id");

ALTER TABLE "checklists" ADD FOREIGN KEY ("assigned_to") REFERENCES "users" ("id");

ALTER TABLE "checklist_items" ADD FOREIGN KEY ("checklist_id") REFERENCES "checklists" ("id");

ALTER TABLE "checklist_items" ADD FOREIGN KEY ("item_id") REFERENCES "checklist_types_items" ("id");

ALTER TABLE "checklist_items" ADD FOREIGN KEY ("attachment_id") REFERENCES "ticket_attachments" ("id");

ALTER TABLE "menu_links" ADD FOREIGN KEY ("user_group") REFERENCES "user_group" ("id");

CREATE UNIQUE INDEX ON "ticket_fields" ("ticket_id", "field_type");

CREATE UNIQUE INDEX ON "checklist_types" ("user_group", "deal_type", "with_trade");

CREATE INDEX ON "vehicles" ("vin");

COMMENT ON TABLE "users" IS 'All users';

COMMENT ON COLUMN "guests"."created_by" IS 'Including this field in cases where sales rep who created is not the assigned rep';

COMMENT ON COLUMN "tickets"."created_by" IS 'may be redundant because of ticket_history table';

COMMENT ON COLUMN "ticket_attachment_type"."ticket_type" IS 'If = 0, valid for all ticket_types';

COMMENT ON COLUMN "deliveries"."delivery_time" IS 'null if not scheduled';

COMMENT ON COLUMN "delivery_queues"."checklist_id" IS 'if = 0, sales rep will be able to add ticket to delivery queue without completing checklist';

COMMENT ON COLUMN "delivery_queues"."updated" IS 'might be redundant with delivery_queue_step table';

COMMENT ON COLUMN "delivery_queue_type"."user_group" IS 'User group the ticket queue will be serving';

COMMENT ON COLUMN "delivery_queue_type"."support_group" IS 'User group that will be assigned and completing queue tasks';

COMMENT ON COLUMN "delivery_queue_type"."manager_group" IS 'User group that will be able to see and manage all queue tasks';

COMMENT ON TABLE "vehicles" IS 'As VINs are decoded, this table will populate to minimize API calls';

create materialized view all_tickets
as
select t.id, g.name as guest, g.id as guest_id, concat(s.first, ' ', s.last) as sales, s.id as sales_id, concat(m.first, ' ', m.last) as manager, m.id as manager_id, tt.name as type, tt.id as type_id, ts.name as status, ts.id as status_id, t.vin, t.created, concat(c.first, ' ', c.last) as created_by, t.created_by as created_by_id, t.last_update as lastUpdate, t.closed, t.showroom, t.appointment
from
tickets as t
join users as s on t.sales_id = s.id
join users as m on t.manager_id = m.id
join users as c on t.created_by = c.id
join guests as g on t.guest_id = g.id
join ticket_type as tt on t.ticket_type = tt.id
join ticket_status as ts on t.current_status = ts.id;

create materialized view available_managers
as
select u.id as manager_id, concat(u.first,' ', u.last) as name, u.email, u.phone, u.available, ug.id as group_id, ug.name as group_name, sum(case when ts.active = true then tt.weight else 0 end) as active_count, sum(tt.weight) as total_count
from tickets as t
join users as u on t.manager_id = u.id
join user_group as ug on u.user_group = ug.id
join ticket_status as ts on t.current_status = ts.id
join ticket_type as tt on t.ticket_type = tt.id
where ug.manager = true and u.available = true
group by u.id, u.first, u.last, u.email, u.phone, u.available, ug.id, ug.name;

INSERT INTO ticket_type (name) VALUES ('Finance');
INSERT INTO ticket_type (name) VALUES ('Cash');
INSERT INTO ticket_type (name) VALUES ('OSF');

INSERT INTO ticket_attachment_type (name, ticket_type) VALUES ('Proof of income', 1);
INSERT INTO ticket_attachment_type (name, ticket_type) VALUES ('Proof of residence', 1);

INSERT INTO ticket_status (ticket_type, name, new_ticket, accepted, delivery_ready, closed) VALUES (1, 'New', true, false, false, false);
INSERT INTO ticket_status (ticket_type, name, new_ticket, accepted, delivery_ready, closed) VALUES (2, 'New', true, false, false, false);
INSERT INTO ticket_status (ticket_type, name, new_ticket, accepted, delivery_ready, closed) VALUES (3, 'New', true, false, false, false);
INSERT INTO ticket_status (ticket_type, name, new_ticket, accepted, delivery_ready, closed) VALUES (1, 'Working', false, true, false, false);
INSERT INTO ticket_status (ticket_type, name, new_ticket, accepted, delivery_ready, closed) VALUES (2, 'Working', false, true, false, false);
INSERT INTO ticket_status (ticket_type, name, new_ticket, accepted, delivery_ready, closed) VALUES (3, 'Working', false, true, false, false);
INSERT INTO ticket_status (ticket_type, name, new_ticket, accepted, delivery_ready, closed) VALUES (1, 'Rehash', false, false, false, false);
INSERT INTO ticket_status (ticket_type, name, new_ticket, accepted, delivery_ready, closed) VALUES (1, 'Declined', false, false, false, false);
INSERT INTO ticket_status (ticket_type, name, new_ticket, accepted, delivery_ready, closed) VALUES (1, 'Approved', false, false, false, false);
INSERT INTO ticket_status (ticket_type, name, new_ticket, accepted, delivery_ready, closed) VALUES (2, 'Structured', false, false, false, false);
INSERT INTO ticket_status (ticket_type, name, new_ticket, accepted, delivery_ready, closed) VALUES (3, 'Structured', false, false, false, false);
INSERT INTO ticket_status (ticket_type, name, new_ticket, accepted, delivery_ready, closed) VALUES (1, 'Sold', false, false, true, false);
INSERT INTO ticket_status (ticket_type, name, new_ticket, accepted, delivery_ready, closed) VALUES (2, 'Sold', false, false, true, false);
INSERT INTO ticket_status (ticket_type, name, new_ticket, accepted, delivery_ready, closed) VALUES (3, 'Sold', false, false, true, false);
INSERT INTO ticket_status (ticket_type, name, new_ticket, accepted, delivery_ready, closed) VALUES (1, 'Closed', false, false, false, true);
INSERT INTO ticket_status (ticket_type, name, new_ticket, accepted, delivery_ready, closed) VALUES (2, 'Closed', false, false, false, true);
INSERT INTO ticket_status (ticket_type, name, new_ticket, accepted, delivery_ready, closed) VALUES (3, 'Closed', false, false, false, true);

insert into user_group (name, manager, admin, support, support_manager) values ('Admin', false, true, true, true);
insert into user_group (name, manager, admin, support, support_manager) values ('Sales Rep', false, false, false, false);
insert into user_group (name, manager, admin, support, support_manager) values ('Finance Manager', true, false, false, false);

insert into users (email, first) values ('jeff@palmytree.com', 'SuperAdmin');

insert into ticket_field_type (name, description, ticket_type, type, is_validated, valid_options, regex, created_by) values ('Down Payment', 'Max down payment guest has available right now', 1, 'number', false, null, null, 2);
insert into ticket_field_type (name, description, ticket_type, type, is_validated, valid_options, regex, created_by) values ('Monthly Payment', 'Monthly payment the guest is anticipating/expecting', 1, 'number', false, null, null, 2);
insert into ticket_field_type (name, description, ticket_type, type, is_validated, valid_options, regex, created_by) values ('Drafting Instructions', 'EG has confirmed the Guest is able to provide a Certified Check', 3, 'list', true, '{"Yes","No"}', null, 2);
insert into ticket_field_type (name, description, ticket_type, type, is_validated, valid_options, regex, created_by, default_option) values ('Registration State', 'Which state is will the guest be registering the vehicle?', 2, 'list', true, '{"AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"}', null, 2, 'TX');
insert into ticket_field_type (name, description, ticket_type, type, is_validated, valid_options, regex, created_by, default_option) values ('Registration State', 'Which state is will the guest be registering the vehicle?', 1, 'list', true, '{"AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"}', null, 2, 'TX');
insert into ticket_field_type (name, description, ticket_type, type, is_validated, valid_options, regex, created_by, default_option) values ('Registration State', 'Which state is will the guest be registering the vehicle?', 3, 'list', true, '{"AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"}', null, 2, 'TX');