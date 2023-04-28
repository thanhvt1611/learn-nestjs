import { DataSource, DataSourceOptions } from 'typeorm';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const getTypeOrmModuleOptions = (): TypeOrmModuleOptions => {
  const dbOptions = {
    synchronize: false,
    autoLoadEntities: true,
    entities: ['dist/**/*.entity.js'],
  };

  switch (process.env.NODE_ENV) {
    case 'development':
      Object.assign(dbOptions, {
        type: 'sqlite',
        database: process.env.DB_NAME || 'db.sqlite',
      });
      break;
    case 'test':
      Object.assign(dbOptions, {
        type: 'sqlite',
        database: 'test.sqlite',
      });
      break;
    case 'production':
      Object.assign(dbOptions, {
        type: 'postgres',
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT) || 5432,
        database: process.env.DB_NAME,
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
      });
      break;
    default:
      throw new Error('unknown environment');
  }
  return dbOptions;
};

export const getDataSourceOptions = (): DataSourceOptions => {
  const options: DataSourceOptions = {
    ...getTypeOrmModuleOptions(),
  } as DataSourceOptions;
  Object.assign(options, {
    migrationsTableName: '__migrations',
    migrations: ['./dist/config/migrations/{*.ts, *.js}'],
    cli: {
      migrationsDir: 'src/config/migrations',
    },
  } as Partial<DataSourceOptions>);
  return options;
};

const dataSource = new DataSource(getDataSourceOptions());
dataSource
  .initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization', err);
  });
export default dataSource;
