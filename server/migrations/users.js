/* eslint-disable no-console */
const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
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
        is_agent SMALLINT DEFAULT 0,
        created_date TIMESTAMP,
        modified_date TIMESTAMP
      )`;

  pool
    .query(queryText)
    .then((res) => {
      console.log('User table created successfully');
      pool.end();
    })
    .catch((err) => {
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
    .then((res) => {
      console.log('Dropped users table');
      pool.end();
    })
    .catch((err) => {
      console.log('Could not drop user table');
      pool.end();
    });
};

export {
  createUserTable,
  dropUserTable,
};
