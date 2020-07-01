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
  'ticket',
  'guest',
  'cosigner',
  'sales',
  'manager',
  'type',
  'status',
  'vin',
  'showroom',
  'attachment',
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
  "activation" uuid,
  "activated" bool
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
  "name" varchar(50) UNIQUE,
  "weight" int
);

CREATE TABLE "admin_ticket_status" (
  "id" serial PRIMARY KEY,
  "ticket_type" int,
  "lifecycle" ticket_lifecycle,
  "name" varchar(100)
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
  "ticket_count" int
);

CREATE TABLE "ticket_activity" (
  "id" serial UNIQUE PRIMARY KEY,
  "ticket_id" int,
  "action" action_types,
  "activity" ticket_activity_types,
  "activity_id" int,
  "current" text,
  "previous" text,
  "logged" timestamptz(2) DEFAULT (now()),
  "user_id" uuid,
  "private" boolean
);

CREATE TABLE "ticket_assignment" (
  "id" serial UNIQUE PRIMARY KEY,
  "ticket_id" int,
  "assigned_to" uuid,
  "logged" timestamptz(2) DEFAULT (now())
);

CREATE TABLE "email_activation" (
  "id" uuid UNIQUE PRIMARY KEY DEFAULT (uuid_generate_v4()),
  "user_id" uuid,
  "activation" text,
  "message" json,
  "to" text,
  "created" timestamptz(2) DEFAULT (now()),
  "expiration" timestamptz(2)
);

ALTER TABLE "users" ADD FOREIGN KEY ("activation") REFERENCES "email_activation" ("id");

ALTER TABLE "email_activation" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

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
