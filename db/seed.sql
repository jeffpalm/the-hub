DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;
create extension if not exists "uuid-ossp";

CREATE TYPE "ticket_lifecycle" AS ENUM (
  'new',
  'queued',
  'accepted',
  'disposed',
  'closed',
  'sold',
  'archived'
);

CREATE TYPE "action_types" AS ENUM (
  'created',
  'read',
  'updated',
  'deleted'
);

CREATE TYPE "ticket_activity_types" AS ENUM (
  'guest_id',
  'cosigner_id',
  'sales_id',
  'manager_id',
  'type',
  'status',
  'vin',
  'showroom',
  'attachment',
  'attachment_type',
  'attachment_filepath',
  'appointment',
  'message'
);

CREATE TABLE "users" (
  "id" uuid UNIQUE PRIMARY KEY DEFAULT (uuid_generate_v4()),
  "email" text,
  "password" text,
  "name" varchar(200),
  "phone" varchar(10) UNIQUE,
  "role" int,
  "available" bool DEFAULT false,
  "reset_count" int,
  "require_reset" bool DEFAULT true,
  "created" timestamptz(2) DEFAULT (now()),
  "last_reset" timestamptz(2),
  "last_visit" timestamptz(2),
  "activation" text
);

CREATE TABLE "user_role" (
  "id" serial PRIMARY KEY,
  "name" varchar(50) UNIQUE,
  "sales" boolean,
  "manager" boolean,
  "admin" boolean,
  "support" boolean,
  "support_manager" boolean
);

CREATE TABLE "guests" (
  "id" serial UNIQUE PRIMARY KEY,
  "name" varchar(200),
  "phone" varchar(10)
);

CREATE TABLE "admin_ticket_type" (
  "id" serial PRIMARY KEY,
  "name" varchar(50) UNIQUE
);

CREATE TABLE "admin_ticket_status" (
  "id" serial PRIMARY KEY,
  "ticket_type" int,
  "lifecycle" ticket_lifecycle,
  "name" varchar(50)
);

CREATE TABLE "admin_attachment_type" (
  "id" serial PRIMARY KEY,
  "ticket_type" int,
  "name" varchar(100) UNIQUE,
  "description" varchar(500)
);

CREATE TABLE "admin_menu_links" (
  "id" serial UNIQUE PRIMARY KEY,
  "user_role" int,
  "text" varchar(50),
  "url" varchar(2000),
  "order" int
);

CREATE TABLE "tickets" (
  "id" serial UNIQUE PRIMARY KEY,
  "guest_id" int,
  "cosigner_id" int,
  "sales_id" uuid,
  "manager_id" uuid,
  "type" int,
  "status" int,
  "vin" varchar(17),
  "showroom" boolean
);

CREATE TABLE "ticket_messages" (
  "id" serial UNIQUE PRIMARY KEY,
  "ticket_id" int,
  "private" boolean,
  "message" varchar(1000)
);

CREATE TABLE "ticket_attachments" (
  "id" serial UNIQUE PRIMARY KEY,
  "ticket_id" int,
  "type" int,
  "filepath" text
);

CREATE TABLE "ticket_appointments" (
  "id" serial UNIQUE PRIMARY KEY,
  "ticket_id" int,
  "appointment" timestamptz(2)
);

CREATE TABLE "vehicles" (
  "vin" varchar(17) UNIQUE PRIMARY KEY,
  "year" int,
  "make" varchar(100),
  "model" varchar(100),
  "trim" varchar(100),
  "color" varchar(100),
  "ticketCount" int
);

CREATE TABLE "ticket_activity" (
  "id" serial UNIQUE PRIMARY KEY,
  "ticket_id" int,
  "action" action_types,
  "activity" ticket_activity_types,
  "current" text,
  "previous" text,
  "logged" timestamptz(2) DEFAULT (now()),
  "user_id" uuid
);

CREATE TABLE "ticket_assignment" (
  "id" serial UNIQUE PRIMARY KEY,
  "ticket_id" int,
  "assigned_to" uuid,
  "logged" timestamptz(2) DEFAULT (now())
);

ALTER TABLE "users" ADD FOREIGN KEY ("role") REFERENCES "user_role" ("id");

ALTER TABLE "admin_attachment_type" ADD FOREIGN KEY ("ticket_type") REFERENCES "admin_ticket_type" ("id");

ALTER TABLE "admin_ticket_status" ADD FOREIGN KEY ("ticket_type") REFERENCES "admin_ticket_type" ("id");

ALTER TABLE "admin_menu_links" ADD FOREIGN KEY ("user_role") REFERENCES "user_role" ("id");

ALTER TABLE "ticket_messages" ADD FOREIGN KEY ("ticket_id") REFERENCES "tickets" ("id");

ALTER TABLE "ticket_attachments" ADD FOREIGN KEY ("ticket_id") REFERENCES "tickets" ("id");

ALTER TABLE "tickets" ADD FOREIGN KEY ("guest_id") REFERENCES "guests" ("id");

ALTER TABLE "tickets" ADD FOREIGN KEY ("cosigner_id") REFERENCES "guests" ("id");

ALTER TABLE "tickets" ADD FOREIGN KEY ("sales_id") REFERENCES "users" ("id");

ALTER TABLE "tickets" ADD FOREIGN KEY ("manager_id") REFERENCES "users" ("id");

ALTER TABLE "tickets" ADD FOREIGN KEY ("type") REFERENCES "admin_ticket_type" ("id");

ALTER TABLE "tickets" ADD FOREIGN KEY ("status") REFERENCES "admin_ticket_status" ("id");

ALTER TABLE "tickets" ADD FOREIGN KEY ("vin") REFERENCES "vehicles" ("vin");

ALTER TABLE "ticket_attachments" ADD FOREIGN KEY ("type") REFERENCES "admin_attachment_type" ("id");

ALTER TABLE "ticket_assignment" ADD FOREIGN KEY ("assigned_to") REFERENCES "users" ("id");

ALTER TABLE "ticket_assignment" ADD FOREIGN KEY ("ticket_id") REFERENCES "tickets" ("id");

ALTER TABLE "ticket_activity" ADD FOREIGN KEY ("ticket_id") REFERENCES "tickets" ("id");

ALTER TABLE "ticket_activity" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "ticket_appointments" ADD FOREIGN KEY ("ticket_id") REFERENCES "tickets" ("id");

COMMENT ON TABLE "users" IS 'All users';

COMMENT ON COLUMN "user_role"."sales" IS 'Can create tickets';

COMMENT ON COLUMN "user_role"."manager" IS 'Can be assigned tickets';

COMMENT ON COLUMN "user_role"."admin" IS 'Can modify any admin table';

COMMENT ON COLUMN "user_role"."support" IS 'For ticket queue support role';

COMMENT ON COLUMN "user_role"."support_manager" IS 'For ticket queue support managers';

COMMENT ON TABLE "vehicles" IS 'As VINs are decoded, this table will populate to minimize API calls';


INSERT INTO admin_ticket_type (id, name) VALUES (1, 'Finance');
INSERT INTO admin_ticket_type (id, name) VALUES (2, 'Cash');
INSERT INTO admin_ticket_type (id, name) VALUES (3, 'OSF');

INSERT INTO admin_attachment_type (name, ticket_type) VALUES ('Proof of income', 1);
INSERT INTO admin_attachment_type (name, ticket_type) VALUES ('Proof of residence', 1);

INSERT INTO admin_ticket_status (ticket_type, name, lifecycle) VALUES (1, 'New', 'new');
INSERT INTO admin_ticket_status (ticket_type, name, lifecycle) VALUES (2, 'New', 'new');
INSERT INTO admin_ticket_status (ticket_type, name, lifecycle) VALUES (3, 'New', 'new');
INSERT INTO admin_ticket_status (ticket_type, name, lifecycle) VALUES (1, 'Working', 'accepted');
INSERT INTO admin_ticket_status (ticket_type, name, lifecycle) VALUES (2, 'Working', 'accepted');
INSERT INTO admin_ticket_status (ticket_type, name, lifecycle) VALUES (3, 'Working', 'accepted');
INSERT INTO admin_ticket_status (ticket_type, name, lifecycle) VALUES (1, 'Rehash', 'new');
INSERT INTO admin_ticket_status (ticket_type, name, lifecycle) VALUES (1, 'Declined', 'disposed');
INSERT INTO admin_ticket_status (ticket_type, name, lifecycle) VALUES (1, 'Approved', 'disposed');
INSERT INTO admin_ticket_status (ticket_type, name, lifecycle) VALUES (2, 'Structured', 'disposed');
INSERT INTO admin_ticket_status (ticket_type, name, lifecycle) VALUES (3, 'Structured', 'disposed');
INSERT INTO admin_ticket_status (ticket_type, name, lifecycle) VALUES (1, 'Sold', 'sold');
INSERT INTO admin_ticket_status (ticket_type, name, lifecycle) VALUES (2, 'Sold', 'sold');
INSERT INTO admin_ticket_status (ticket_type, name, lifecycle) VALUES (3, 'Sold', 'sold');
INSERT INTO admin_ticket_status (ticket_type, name, lifecycle) VALUES (1, 'Closed', 'closed');
INSERT INTO admin_ticket_status (ticket_type, name, lifecycle) VALUES (2, 'Closed', 'closed');
INSERT INTO admin_ticket_status (ticket_type, name, lifecycle) VALUES (3, 'Closed', 'closed');

insert into user_role (id, name, manager, admin, support, support_manager, sales) values (1, 'Admin', false, true, true, true, false);
insert into user_role (id, name, manager, admin, support, support_manager, sales) values (2, 'Manager', true, false, false, false, false);
insert into user_role (id, name, manager, admin, support, support_manager, sales) values (3, 'Experience Guide', false, false, false, false, true);