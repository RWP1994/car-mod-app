import knex from 'knex';
import knexfile from './knexfile.cjs';
import dotenv from 'dotenv';
dotenv.config();

const environment = process.env.NODE_ENV || 'development';
const db = knex(knexfile[environment]);

export default db;
