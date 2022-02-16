import 'express-async-errors';
import { errorHandler } from './errors/common';
import express, { json } from 'express';
import { formRoutes } from './routes/form.route';
import * as swagger from 'swagger-express-ts';

const app = express();
app.use(json());

app.use('/api/v1/forms', formRoutes);
app.use('/api-docs/swagger', express.static('swagger'));
app.use(
  '/api-docs/swagger/assets',
  express.static('node_modules/swagger-ui-dist')
);

app.use(errorHandler);

app.use(
  swagger.express({
    definition: {
      info: {
        title: 'Heritance Collect data API',
        version: '1.0',
      },
    },
  })
);

app.all('*', async (req, res) => {
  res.status(404).send('Route not found');
});

export { app };
