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
const createPropertyTable = () => {
  const queryText = `CREATE TABLE IF NOT EXISTS
  property(
      id serial PRIMARY KEY,
      agent_id Integer NOT NULL,
      status TEXT NOT NULL,
      state TEXT NOT NULL,
      city TEXT NOT NULL,
      price Float NOT NULL,
      address TEXT NOT NULL,
      type TEXT NOT NULL,
      image_url  TEXT NOT NULL,
      created_on TIMESTAMP NOT NULL,
      updated_on TIMESTAMP NOT NULL
      )`;

  pool
    .query(queryText)
    .then((res) => {
      console.log('Property table created successfully: ', res);
      pool.end();
    })
    .catch((err) => {
      console.log('Could not create property table', err);
      pool.end();
    });
};

/**
 * Drop Tables
 */
const dropPropertyTable = () => {
  const queryText = 'DROP TABLE IF EXISTS property';
  pool
    .query(queryText)
    .then((res) => {
      console.log('Dropped property table', res);
      pool.end();
    })
    .catch((err) => {
      console.log('Could not drop property table', err);
      pool.end();
    });
};

export { createPropertyTable, dropPropertyTable };
