import express, { Request, Response } from 'express';
import 'reflect-metadata';
import { createConnection } from 'typeorm';
import { FormController } from './controller/form.controller'; // import the post controller

class Server {
  private formController: FormController;
  private app: express.Application;

  constructor() {
    this.app = express(); // init the application
    this.configuration();
    this.routes();
  }

  /**
   * Method to configure the server,
   * If we didn't configure the port into the environment
   * variables it takes the default port 3000
   */
  public configuration() {
    this.app.set('port', process.env.PORT || 3001);
    this.app.use(express.json());
  }

  /**
   * Method to configure the routes
   */
  public async routes() {
    await createConnection({
      // TODO: Use env variable instead
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'hoang123',
      database: 'heritance',
      entities: ['build/database/entities/**/*{.ts,.js}'],
      synchronize: true,
    });

    this.formController = new FormController();

    this.app.get('/', (req: Request, res: Response) => {
      res.send('Hello world!');
    });

    this.app.use(`/api/v1/forms/`, this.formController.router);
  }

  /**
   * Used to start the server
   */
  public start() {
    this.app.listen(this.app.get('port'), () => {
      console.log(`Server is listening ${this.app.get('port')} port.`);
    });
  }
}

const server = new Server(); // Create server instance
server.start(); // Execute the server
