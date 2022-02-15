import { createConnection } from 'typeorm';
import { connectDb } from './connection';
import { app } from './server';

const start = async () => {
  await connectDb();

  app.listen(3000, () => console.log('Listening on PORT 3000'));
};

start();
