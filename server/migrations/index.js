import { createUserTable, dropUserTable } from './users';
import { createPropertyTable, dropPropertyTable } from './property';

const dropAllTables = async () => {
  await dropPropertyTable();
  await dropUserTable();
};

const createAllTables = async () => {
  await createUserTable();
  await createPropertyTable();
};

module.exports = {
  dropAllTables,
  createAllTables,
};

require('make-runnable');
