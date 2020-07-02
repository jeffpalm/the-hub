DROP SCHEMA PUBLIC CASCADE;

CREATE SCHEMA PUBLIC;

GRANT ALL ON SCHEMA PUBLIC TO postgres;

GRANT ALL ON SCHEMA PUBLIC TO PUBLIC;

CREATE extension IF NOT EXISTS "uuid-ossp";

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
  "name" VARCHAR(200),
  "phone" VARCHAR(10) UNIQUE,
  "role" INT,
  "available" bool DEFAULT FALSE,
  "reset_count" INT,
  "require_reset" bool DEFAULT TRUE,
  "created" timestamptz(2) DEFAULT (NOW()),
  "last_reset" timestamptz(2),
  "last_visit" timestamptz(2),
  "activation" text
);

CREATE TABLE "user_role" (
  "id" serial PRIMARY KEY,
  "name" VARCHAR(50) UNIQUE,
  "sales" BOOLEAN,
  "manager" BOOLEAN,
  "admin" BOOLEAN,
  "support" BOOLEAN,
  "support_manager" BOOLEAN
);

CREATE TABLE "guests" (
  "id" serial UNIQUE PRIMARY KEY,
  "name" VARCHAR(200),
  "phone" VARCHAR(10)
);

CREATE TABLE "admin_ticket_type" (
  "id" serial PRIMARY KEY,
  "name" VARCHAR(50) UNIQUE,
  "weight" INT
);

CREATE TABLE "admin_ticket_status" (
  "id" serial PRIMARY KEY,
  "ticket_type" INT,
  "lifecycle" ticket_lifecycle,
  "name" VARCHAR(50)
);

CREATE TABLE "admin_attachment_type" (
  "id" serial PRIMARY KEY,
  "ticket_type" INT,
  "name" VARCHAR(100) UNIQUE,
  "description" VARCHAR(500)
);

CREATE TABLE "admin_menu_links" (
  "id" serial UNIQUE PRIMARY KEY,
  "user_role" INT,
  "text" VARCHAR(50),
  "url" VARCHAR(2000),
  "order" INT
);

CREATE TABLE "tickets" (
  "id" serial UNIQUE PRIMARY KEY,
  "guest_id" INT,
  "cosigner_id" INT,
  "sales_id" uuid,
  "manager_id" uuid,
  "type" INT,
  "status" INT,
  "vin" VARCHAR(17),
  "showroom" BOOLEAN
);

CREATE TABLE "ticket_messages" (
  "id" serial UNIQUE PRIMARY KEY,
  "ticket_id" INT,
  "private" BOOLEAN,
  "message" VARCHAR(1000)
);

CREATE TABLE "ticket_attachments" (
  "id" serial UNIQUE PRIMARY KEY,
  "ticket_id" INT,
  "type" INT,
  "filepath" text
);

CREATE TABLE "ticket_appointments" (
  "id" serial UNIQUE PRIMARY KEY,
  "ticket_id" INT,
  "appointment" timestamptz(2)
);

CREATE TABLE "vehicles" (
  "vin" VARCHAR(17) UNIQUE PRIMARY KEY,
  "year" INT,
  "make" VARCHAR(100),
  "model" VARCHAR(100),
  "trim" VARCHAR(100),
  "color" VARCHAR(100),
  "ticket_count" INT
);

CREATE TABLE "ticket_activity" (
  "id" serial UNIQUE PRIMARY KEY,
  "ticket_id" INT,
  "action" action_types,
  "activity" ticket_activity_types,
  "activity_id" INT,
  "current" text,
  "previous" text,
  "logged" timestamptz(2) DEFAULT (NOW()),
  "user_id" uuid
);

CREATE TABLE "ticket_assignment" (
  "id" serial UNIQUE PRIMARY KEY,
  "ticket_id" INT,
  "assigned_to" uuid,
  "logged" timestamptz(2) DEFAULT (NOW())
);

CREATE TABLE user_modification_log(
  "id" SERIAL PRIMARY KEY,
  "user_id" UUID,
  "action" ACTION_TYPES,
  "current" JSON,
  "previous" JSON,
  "modified_by" UUID,
  "logged" TIMESTAMPTZ(2) DEFAULT (now())
);

CREATE TABLE email_log(
  "id" SERIAL PRIMARY KEY,
  "info" JSON,
  "error" JSON,
  "message" JSON,
  "logged" TIMESTAMPTZ(2) DEFAULT (now())
);

ALTER TABLE
  user_modification_log
ADD
  FOREIGN KEY ("user_id") REFERENCES users(id);

ALTER TABLE
  user_modification_log
ADD
  FOREIGN KEY ("modified_by") REFERENCES users(id);

ALTER TABLE
  "users"
ADD
  FOREIGN KEY ("role") REFERENCES "user_role" ("id");

ALTER TABLE
  "admin_attachment_type"
ADD
  FOREIGN KEY ("ticket_type") REFERENCES "admin_ticket_type" ("id");

ALTER TABLE
  "admin_ticket_status"
ADD
  FOREIGN KEY ("ticket_type") REFERENCES "admin_ticket_type" ("id");

ALTER TABLE
  "admin_menu_links"
ADD
  FOREIGN KEY ("user_role") REFERENCES "user_role" ("id");

ALTER TABLE
  "ticket_messages"
ADD
  FOREIGN KEY ("ticket_id") REFERENCES "tickets" ("id");

ALTER TABLE
  "ticket_attachments"
ADD
  FOREIGN KEY ("ticket_id") REFERENCES "tickets" ("id");

ALTER TABLE
  "tickets"
ADD
  FOREIGN KEY ("guest_id") REFERENCES "guests" ("id");

ALTER TABLE
  "tickets"
ADD
  FOREIGN KEY ("cosigner_id") REFERENCES "guests" ("id");

ALTER TABLE
  "tickets"
ADD
  FOREIGN KEY ("sales_id") REFERENCES "users" ("id");

ALTER TABLE
  "tickets"
ADD
  FOREIGN KEY ("manager_id") REFERENCES "users" ("id");

ALTER TABLE
  "tickets"
ADD
  FOREIGN KEY ("type") REFERENCES "admin_ticket_type" ("id");

ALTER TABLE
  "tickets"
ADD
  FOREIGN KEY ("status") REFERENCES "admin_ticket_status" ("id");

ALTER TABLE
  "tickets"
ADD
  FOREIGN KEY ("vin") REFERENCES "vehicles" ("vin");

ALTER TABLE
  "ticket_attachments"
ADD
  FOREIGN KEY ("type") REFERENCES "admin_attachment_type" ("id");

ALTER TABLE
  "ticket_assignment"
ADD
  FOREIGN KEY ("assigned_to") REFERENCES "users" ("id");

ALTER TABLE
  "ticket_assignment"
ADD
  FOREIGN KEY ("ticket_id") REFERENCES "tickets" ("id");

ALTER TABLE
  "ticket_activity"
ADD
  FOREIGN KEY ("ticket_id") REFERENCES "tickets" ("id");

ALTER TABLE
  "ticket_activity"
ADD
  FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE
  "ticket_appointments"
ADD
  FOREIGN KEY ("ticket_id") REFERENCES "tickets" ("id");

COMMENT ON TABLE "users" IS 'All users';

COMMENT ON COLUMN "user_role"."sales" IS 'Can create tickets';

COMMENT ON COLUMN "user_role"."manager" IS 'Can be assigned tickets';

COMMENT ON COLUMN "user_role"."admin" IS 'Can modify any admin table';

COMMENT ON COLUMN "user_role"."support" IS 'For ticket queue support role';

COMMENT ON COLUMN "user_role"."support_manager" IS 'For ticket queue support managers';

COMMENT ON TABLE "vehicles" IS 'As VINs are decoded, this table will populate to minimize API calls';

INSERT INTO
  users (id, NAME)
VALUES
  (
    '84d5fc61-90f1-4d5e-a2d3-cb8ea7433ac2',
    'Unassigned'
  )
INSERT INTO
  admin_ticket_type (id, NAME, weight)
VALUES
  (1, 'Finance', 2);

INSERT INTO
  admin_ticket_type (id, NAME, weight)
VALUES
  (2, 'Cash', 1);

INSERT INTO
  admin_ticket_type (id, NAME, weight)
VALUES
  (3, 'OSF', 1);

INSERT INTO
  admin_attachment_type (NAME, ticket_type)
VALUES
  ('Proof of income', 1);

INSERT INTO
  admin_attachment_type (NAME, ticket_type)
VALUES
  ('Proof of residence', 1);

INSERT INTO
  admin_ticket_status (ticket_type, NAME, lifecycle)
VALUES
  (1, 'New', 'new');

INSERT INTO
  admin_ticket_status (ticket_type, NAME, lifecycle)
VALUES
  (2, 'New', 'new');

INSERT INTO
  admin_ticket_status (ticket_type, NAME, lifecycle)
VALUES
  (3, 'New', 'new');

INSERT INTO
  admin_ticket_status (ticket_type, NAME, lifecycle)
VALUES
  (1, 'Working', 'accepted');

INSERT INTO
  admin_ticket_status (ticket_type, NAME, lifecycle)
VALUES
  (2, 'Working', 'accepted');

INSERT INTO
  admin_ticket_status (ticket_type, NAME, lifecycle)
VALUES
  (3, 'Working', 'accepted');

INSERT INTO
  admin_ticket_status (ticket_type, NAME, lifecycle)
VALUES
  (1, 'Rehash', 'new');

INSERT INTO
  admin_ticket_status (ticket_type, NAME, lifecycle)
VALUES
  (1, 'Declined', 'disposed');

INSERT INTO
  admin_ticket_status (ticket_type, NAME, lifecycle)
VALUES
  (1, 'Approved', 'disposed');

INSERT INTO
  admin_ticket_status (ticket_type, NAME, lifecycle)
VALUES
  (2, 'Structured', 'disposed');

INSERT INTO
  admin_ticket_status (ticket_type, NAME, lifecycle)
VALUES
  (3, 'Structured', 'disposed');

INSERT INTO
  admin_ticket_status (ticket_type, NAME, lifecycle)
VALUES
  (1, 'Sold', 'sold');

INSERT INTO
  admin_ticket_status (ticket_type, NAME, lifecycle)
VALUES
  (2, 'Sold', 'sold');

INSERT INTO
  admin_ticket_status (ticket_type, NAME, lifecycle)
VALUES
  (3, 'Sold', 'sold');

INSERT INTO
  admin_ticket_status (ticket_type, NAME, lifecycle)
VALUES
  (1, 'Closed', 'closed');

INSERT INTO
  admin_ticket_status (ticket_type, NAME, lifecycle)
VALUES
  (2, 'Closed', 'closed');

INSERT INTO
  admin_ticket_status (ticket_type, NAME, lifecycle)
VALUES
  (3, 'Closed', 'closed');

INSERT INTO
  user_role (
    id,
    NAME,
    manager,
    admin,
    support,
    support_manager,
    sales
  )
VALUES
  (1, 'Admin', FALSE, TRUE, TRUE, TRUE, FALSE);

INSERT INTO
  user_role (
    id,
    NAME,
    manager,
    admin,
    support,
    support_manager,
    sales
  )
VALUES
  (2, 'Manager', TRUE, FALSE, FALSE, FALSE, FALSE);

INSERT INTO
  user_role (
    id,
    NAME,
    manager,
    admin,
    support,
    support_manager,
    sales
  )
VALUES
  (
    3,
    'Experience Guide',
    FALSE,
    FALSE,
    FALSE,
    FALSE,
    TRUE
  );

DROP MATERIALIZED VIEW IF EXISTS activity_ticket_message_created;

DROP MATERIALIZED VIEW IF EXISTS activity_ticket_appointment_created;

DROP MATERIALIZED VIEW IF EXISTS activity_ticket_attachment_created;

DROP MATERIALIZED VIEW IF EXISTS activity_ticket_updated;

DROP MATERIALIZED VIEW IF EXISTS activity_ticket_created;

DROP MATERIALIZED VIEW IF EXISTS activity_ticket_last_update;

DROP MATERIALIZED VIEW IF EXISTS all_tickets;

DROP MATERIALIZED VIEW IF EXISTS available_managers;

CREATE MATERIALIZED VIEW activity_ticket_last_update AS
SELECT
  DISTINCT ON (ta.ticket_id) ta.id,
  ta.ticket_id,
  ta.action,
  ta.activity,
  ta.logged AS last_update,
  ta.user_id,
  u.name AS created_by,
  ur.name AS role
FROM
  ticket_activity ta
  JOIN users u ON ta.user_id = u.id
  JOIN user_role ur ON u.role = ur.id
ORDER BY
  ta.ticket_id,
  ta.logged DESC;

CREATE MATERIALIZED VIEW activity_ticket_created AS
SELECT
  ta.id,
  ta.ticket_id,
  ta.logged AS created,
  ta.user_id,
  u.name AS created_by,
  ur.name AS role
FROM
  ticket_activity ta
  JOIN users u ON ta.user_id = u.id
  JOIN user_role ur ON u.role = ur.id
WHERE
  ta.action = 'created'
  AND ta.activity = 'ticket';

CREATE MATERIALIZED VIEW activity_ticket_message_created AS
SELECT
  ta.id,
  ta.ticket_id,
  ta.logged,
  ta.user_id,
  ta.current,
  u.name AS created_by,
  ur.name AS role,
  tm.private
FROM
  ticket_activity ta
  JOIN users u ON ta.user_id = u.id
  JOIN user_role ur ON u.role = ur.id
  JOIN ticket_messages tm ON tm.id = ta.activity_id
WHERE
  ta.action = 'created'
  AND ta.activity = 'message';

CREATE MATERIALIZED VIEW activity_ticket_appointment_created AS
SELECT
  ta.id,
  ta.ticket_id,
  ta.logged,
  ta.current,
  u.name AS created_by,
  ur.name AS role,
  ta.user_id
FROM
  ticket_activity ta
  JOIN users u ON ta.user_id = u.id
  JOIN user_role ur ON u.role = ur.id
WHERE
  ta.action = 'created'
  AND ta.activity = 'appointment';

CREATE MATERIALIZED VIEW activity_ticket_attachment_created AS
SELECT
  ta.id,
  ta.ticket_id,
  ta.logged,
  ta.current,
  u.name AS created_by,
  ur.name AS role,
  ta.user_id
FROM
  ticket_activity ta
  JOIN users u ON ta.user_id = u.id
  JOIN user_role ur ON u.role = ur.id
WHERE
  ta.action = 'created'
  AND ta.activity = 'attachment';

CREATE MATERIALIZED VIEW all_tickets AS
SELECT
  t.id,
  g.name AS guest,
  g.id AS guest_id,
  g.phone AS guest_phone,
  C .name AS cosigner_name,
  C .id AS cosigner_id,
  C .phone AS cosigner_phone,
  s.name AS sales,
  s.phone AS sales_phone,
  s.id AS sales_id,
  m.name AS manager,
  m.id AS manager_id,
  tt.name AS type,
  tt.id AS type_id,
  tt.weight AS type_weight,
  ts.name AS status,
  ts.lifecycle AS status_lifecycle,
  ts.id AS status_id,
  t.vin,
  v.year,
  v.make,
  v.model,
  v.ticket_count AS vehicle_ticket_count,
  atc.created,
  atlu.last_update,
  t.showroom
FROM
  tickets AS t
  JOIN users AS s ON t.sales_id = s.id
  JOIN users AS m ON t.manager_id = m.id
  JOIN guests AS g ON t.guest_id = g.id
  LEFT JOIN guests AS C ON t.cosigner_id = C .id
  JOIN admin_ticket_type AS tt ON t.type = tt.id
  JOIN admin_ticket_status AS ts ON t.status = ts.id
  LEFT JOIN activity_ticket_created AS atc ON atc.ticket_id = t.id
  LEFT JOIN activity_ticket_last_update AS atlu ON atlu.ticket_id = t.id
  JOIN vehicles AS v ON t.vin = v.vin;

CREATE MATERIALIZED VIEW available_managers AS
SELECT
  u.id AS manager_id,
  u.name,
  u.email,
  u.phone,
  u.available,
  ur.id AS role_id,
  ur.name AS role,
  SUM(
    CASE
      WHEN (
        ts.lifecycle = 'new'
        OR ts.lifecycle = 'queued'
        OR ts.lifecycle = 'accepted'
      ) THEN tt.weight
      ELSE 0
    END
  ) AS active_count,
  SUM(tt.weight) AS total_count
FROM
  tickets AS t
  JOIN users AS u ON t.manager_id = u.id
  JOIN user_role AS ur ON u.role = ur.id
  JOIN admin_ticket_status AS ts ON t.status = ts.id
  JOIN admin_ticket_type AS tt ON t.type = tt.id
WHERE
  ur.manager = TRUE
  AND u.available = TRUE
GROUP BY
  u.id,
  u.name,
  u.email,
  u.phone,
  u.available,
  ur.id,
  ur.name;

CREATE UNIQUE INDEX log_id ON activity_ticket_message_created (ticket_id, id);

CREATE UNIQUE INDEX log_id ON activity_ticket_appointment_created (ticket_id, id);

CREATE UNIQUE INDEX log_id ON activity_ticket_attachment_created (ticket_id, id);

CREATE UNIQUE INDEX log_id ON activity_ticket_updated (ticket_id, id);

CREATE UNIQUE INDEX log_id ON activity_ticket_created (ticket_id, id);

CREATE UNIQUE INDEX log_id ON activity_ticket_last_update (ticket_id, id);

CREATE UNIQUE INDEX manager_id ON available_managers (manager_id);

CREATE UNIQUE INDEX ticket_id ON all_tickets (id);

CREATE
OR REPLACE FUNCTION refresh_views() RETURNS TRIGGER LANGUAGE plpgsql AS $$ BEGIN
  REFRESH MATERIALIZED VIEW activity_ticket_message_created;

REFRESH MATERIALIZED VIEW activity_ticket_appointment_created;

REFRESH MATERIALIZED VIEW activity_ticket_attachment_created;

REFRESH MATERIALIZED VIEW activity_ticket_updated;

REFRESH MATERIALIZED VIEW activity_ticket_created;

REFRESH MATERIALIZED VIEW activity_ticket_last_update;

REFRESH MATERIALIZED VIEW CONCURRENTLY all_tickets;

REFRESH MATERIALIZED VIEW CONCURRENTLY available_managers;

RETURN NULL;

END $$;

CREATE TRIGGER refresh_views AFTER
INSERT
  OR
UPDATE
  OR
DELETE
  OR TRUNCATE ON ticket_activity FOR EACH STATEMENT EXECUTE PROCEDURE refresh_views();

CREATE
OR REPLACE FUNCTION notify_new_activity() RETURNS TRIGGER AS $BODY$ BEGIN
  perform pg_notify('new_ticket_activity', row_to_json(NEW) :: text);

RETURN NULL;

END;

$BODY$ LANGUAGE plpgsql COST 100;

CREATE TRIGGER notify_new_message AFTER
INSERT
  ON "ticket_activity" FOR each ROW EXECUTE PROCEDURE notify_new_message();



select 
date_trunc('day', created) as created,
count(*) filter (where status_lifecycle = 'new') as new_count,
count(*) filter (where status_lifecycle = 'queued') as queued_count,
count(*) filter (where status_lifecycle = 'accepted') as accepted_count,
count(*) filter (where status_lifecycle = 'disposed') as disposed_count,
count(*) filter (where status_lifecycle = 'closed') as closed_count,
count(*) filter (where status_lifecycle = 'sold') as sold_count,
count(*) filter (where status_lifecycle = 'archived') as archived_count,
count(*) as total_count
from all_tickets 
where sales_id = 'fe5a96ce-c77b-425a-a944-3415a685e6f4' group by created;
