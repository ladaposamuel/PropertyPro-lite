import { createUserTable, dropUserTable } from './users';

const dropAllTables = async () => {
  await dropUserTable();
};

const createAllTables = async () => {
  await createUserTable();
};

module.exports = {
  dropAllTables,
  createAllTables,
};

require('make-runnable');
