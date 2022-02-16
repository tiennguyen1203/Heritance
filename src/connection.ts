import { createConnection, getConnection } from 'typeorm';

export const connectDb = async () => {
  const dbConfig = {
    // TODO: Use env variable instead
    type: 'postgres',
    host: process.env.POSTGRES_HOST || 'localhost',
    port: process.env.POSTGRES_PORT || 5432,
    username: process.env.POSTGRES_USER || 'postgres',
    password: process.env.POSTGRES_PASSWORD || 'hoang123',
    database: process.env.POSTGRES_DB || 'heritance',
    entities: ['build/database/entities/**/*{.ts,.js}'],
    synchronize: true,
  };

  await createConnection(dbConfig as any);
};
