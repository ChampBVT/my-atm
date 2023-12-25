import { join } from 'path';
import { DataSourceOptions, LogLevel, LoggerOptions } from 'typeorm';
import 'dotenv/config';
import { SeederOptions } from 'typeorm-extension';

const loggingLevel = (): LoggerOptions => {
  const level = (process.env.DB_LOG_LEVEL || '').trim();

  if (level === 'all') {
    return 'all';
  } else if (level.length > 0) {
    return level.split(',') as LogLevel[];
  } else {
    return ['error'];
  }
};

export default <DataSourceOptions & SeederOptions>{
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number.parseInt(process.env.DB_PORT || ''),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database:
    process.env.ENV === 'e2e'
      ? `${process.env.DB_DATABASE || ''}-e2e`
      : process.env.DB_DATABASE,
  entities: [join(__dirname, 'src/**/*.entity.{js,ts}')],
  migrations: [join(__dirname, 'migrations/**/*.{js,ts}')],
  logging: loggingLevel(),
  seeds: [join(__dirname, 'seeds/**/*.seeder.{js,ts}')],
  factories: [join(__dirname, 'seeds/**/*.factories.{js,ts}')],
  migrationsRun: process.env.ENV === 'e2e',
};
