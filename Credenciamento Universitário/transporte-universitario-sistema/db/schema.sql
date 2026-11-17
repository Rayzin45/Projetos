CREATE TABLE IF NOT EXISTS universities (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL UNIQUE,
  address VARCHAR(200) NOT NULL DEFAULT '',
  active BOOLEAN NOT NULL DEFAULT TRUE
);
CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(180) NOT NULL,
  password_hash TEXT NOT NULL,
  role VARCHAR(15) NOT NULL CHECK (role IN ('admin','student','driver')),
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE UNIQUE INDEX IF NOT EXISTS users_email_unique ON users (LOWER(email));
CREATE TABLE IF NOT EXISTS students (
  user_id BIGINT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  university_id BIGINT NOT NULL REFERENCES universities(id),
  course VARCHAR(120) NOT NULL DEFAULT '',
  phone VARCHAR(30) NOT NULL DEFAULT ''
);
CREATE TABLE IF NOT EXISTS drivers (
  user_id BIGINT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  phone VARCHAR(30) NOT NULL DEFAULT ''
);
CREATE TABLE IF NOT EXISTS vehicles (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(80) NOT NULL UNIQUE,
  plate VARCHAR(12) NOT NULL UNIQUE,
  model VARCHAR(80) NOT NULL DEFAULT '',
  capacity INT NOT NULL CHECK (capacity BETWEEN 1 AND 100),
  active BOOLEAN NOT NULL DEFAULT TRUE
);
CREATE TABLE IF NOT EXISTS route_plans (
  id BIGSERIAL PRIMARY KEY,
  service_date DATE NOT NULL,
  vehicle_id BIGINT NOT NULL REFERENCES vehicles(id),
  driver_id BIGINT REFERENCES drivers(user_id),
  departure_time TIME(0) NOT NULL,
  notes TEXT NOT NULL DEFAULT '',
  UNIQUE(service_date, vehicle_id)
);
CREATE UNIQUE INDEX IF NOT EXISTS route_driver_per_day ON route_plans(service_date,driver_id) WHERE driver_id IS NOT NULL;
CREATE TABLE IF NOT EXISTS route_stops (
  id BIGSERIAL PRIMARY KEY,
  route_plan_id BIGINT NOT NULL REFERENCES route_plans(id) ON DELETE CASCADE,
  university_id BIGINT NOT NULL REFERENCES universities(id),
  position INT NOT NULL CHECK(position>=1),
  UNIQUE(route_plan_id, position),
  UNIQUE(route_plan_id, university_id)
);
CREATE TABLE IF NOT EXISTS notices (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(120) NOT NULL,
  message TEXT NOT NULL,
  created_by BIGINT NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS calendar_events (
  id BIGSERIAL PRIMARY KEY,
  event_date DATE NOT NULL,
  description VARCHAR(200) NOT NULL,
  type VARCHAR(25) NOT NULL CHECK(type IN ('feriado','funcionamento','suspensao','outro')),
  created_by BIGINT REFERENCES users(id)
);
CREATE TABLE IF NOT EXISTS support_tickets (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id),
  subject VARCHAR(150) NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'aberto' CHECK(status IN ('aberto','em_atendimento','resolvido')),
  response TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS incidents (
  id BIGSERIAL PRIMARY KEY,
  driver_id BIGINT NOT NULL REFERENCES drivers(user_id),
  vehicle_id BIGINT REFERENCES vehicles(id),
  service_date DATE NOT NULL,
  type VARCHAR(40) NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS sessions (
  token_hash CHAR(64) PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS sessions_expiry ON sessions(expires_at);
CREATE INDEX IF NOT EXISTS route_stops_university ON route_stops(university_id);
CREATE INDEX IF NOT EXISTS support_user ON support_tickets(user_id);
