const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

let db = process.env.DATABASE_URL;
if (process.env.NODE_ENV === 'test') {
  db = process.env.TEST_DATABASE_URL;
}
// if (process.env.NODE_ENV === 'production') {
//   db = process.env.DATABASE_URL;
// }

const pool = new Pool({
  connectionString: db,
});

module.exports = {
  query: (text, params, callback) => pool.query(text, params, callback),
};
