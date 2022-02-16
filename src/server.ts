import 'express-async-errors';
import { errorHandler } from './errors/common';
import express, { json } from 'express';
import { formRoutes } from './routes/form.route';

const app = express();
app.use(json());

app.use('/api/v1/forms', formRoutes);

app.all('*', async (req, res) => {
  // TODO: Change to 404
  res.status(405).send('Route not found');
});

app.use(errorHandler);

export { app };
