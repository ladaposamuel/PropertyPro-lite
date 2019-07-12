/* eslint-disable no-console */
const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

let db = process.env.DEV_DATABASE_URL;
if (process.env.NODE_ENV === 'test') {
  db = process.env.TEST_DATABASE_URL;
}
if (process.env.NODE_ENV === 'production') {
  db = process.env.DATABASE_URL;
}

const pool = new Pool({
  connectionString: db,
});

pool.on('connect', () => {
  console.log('connected to the db');
});

/**
 * Create Tables
 */
const createUserTable = () => {
  const queryText = `CREATE TABLE IF NOT EXISTS
      users(
        id serial PRIMARY KEY,
        email VARCHAR(128) UNIQUE NOT NULL,
        first_name VARCHAR(128) NOT NULL,
        last_name VARCHAR(128) NOT NULL,
        password VARCHAR(128) NOT NULL,
        phone_number VARCHAR(128) NOT NULL,
        address VARCHAR(128)  NULL,
        is_admin SMALLINT DEFAULT 0,
        created_date TIMESTAMP,
        modified_date TIMESTAMP
      )`;

  pool
    .query(queryText)
    .then(() => {
      console.log('User table created successfully: ');
      pool.end();
    })
    .catch(() => {
      console.log('Could not create user table');
      pool.end();
    });
};

/**
 * Drop Tables
 */
const dropUserTable = () => {
  const queryText = 'DROP TABLE IF EXISTS users';
  pool
    .query(queryText)
    .then(() => {
      console.log('Dropped users table');
      pool.end();
    })
    .catch(() => {
      console.log('Could not drop user table');
      pool.end();
    });
};

export { createUserTable, dropUserTable };
