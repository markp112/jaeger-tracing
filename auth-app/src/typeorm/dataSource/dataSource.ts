import { DataSource } from 'typeorm';
import { logger } from '@logger/logger';

const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  database: 'auth',
  logging: false,
  entities: ['./src/typeorm/entities/**/*.ts'],
});

AppDataSource.initialize()
  .then(() => {
    logger.info('typeOrm Connection to database established');
  })
  .catch((err) => {
    logger.info(`typeOrm Connection to database failed with error ${err}`);
  });

export { AppDataSource };
