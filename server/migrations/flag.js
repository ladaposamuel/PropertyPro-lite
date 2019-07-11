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
const createFlagTable = () => {
  const queryText = `CREATE TABLE IF NOT EXISTS
  flag(
      id serial PRIMARY KEY,
      property_id Integer NOT NULL,
      reason TEXT NOT NULL,
      description TEXT NOT NULL,
      reporter Integer NOT NULL,
      created_on TIMESTAMP NOT NULL
      )`;

  pool
    .query(queryText)
    .then(() => {
      console.log('Flag table created successfully: ');
      pool.end();
    })
    .catch(() => {
      console.log('Could not create flag table');
      pool.end();
    });
};

/**
 * Drop Tables
 */
const dropFlagTable = () => {
  const queryText = 'DROP TABLE IF EXISTS flag';
  pool
    .query(queryText)
    .then(() => {
      console.log('Dropped flag table');
      pool.end();
    })
    .catch(() => {
      console.log('Could not drop flag table');
      pool.end();
    });
};

export { createFlagTable, dropFlagTable };
