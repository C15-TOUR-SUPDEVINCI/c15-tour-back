import 'dotenv/config';
import 'tsconfig-paths/register';
import { DataSource } from 'typeorm';
import path from 'path';

const isProd = process.env.NODE_ENV === 'production';

export default new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3306', 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,

  entities: isProd
    ? [path.join(__dirname, '../modules/**/*.entity.js')]
    : ['src/**/*.entity.ts'],

  migrations: isProd
    ? [path.join(__dirname, '../database/migrations/*.js')]
    : ['src/migrations/*.ts'],

  synchronize: false,
  dropSchema: false,
});
