import { createUserTable, dropUserTable } from './users';
import { createPropertyTable, dropPropertyTable } from './property';
import { createFlagTable, dropFlagTable } from './flag';

const dropAllTables = async () => {
  await dropPropertyTable();
  await dropFlagTable();
  await dropUserTable();
};

const createAllTables = async () => {
  await createUserTable();
  await createFlagTable();
  await createPropertyTable();
};

module.exports = {
  dropAllTables,
  createAllTables,
};

require('make-runnable');
