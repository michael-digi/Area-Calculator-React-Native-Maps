CREATE TABLE users (
  uid SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE,
  steps INT,
  email VARCHAR(255),
  date_created DATE,
  last_login DATE,
  steps_last_update DATE
);
