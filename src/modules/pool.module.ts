import dotenv from 'dotenv';
dotenv.config();

import pkg from 'pg';

const { Pool } = pkg;
export default new Pool({ connectionString: process.env.PG_DATABASE_URL });
