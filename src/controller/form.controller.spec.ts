// Import the dependencies for testing
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import request from 'supertest';
import { getConnection } from 'typeorm';
import { connectDb } from '../connection';
import { FieldEntity } from '../database/entities/field.entity';
import { FormEntity } from '../database/entities/form.entity';
import { app } from '../server';
// Configure chai
chai.use(chaiHttp);
chai.should();
describe('@form.controller.ts', () => {
  describe(`POST api/v1/forms/:id/collect`, () => {
    describe('When missing required field in body', () => {
      beforeEach(async () => {
        await connectDb();
      });

      afterEach(async () => {
        await getConnection().dropDatabase();
        await getConnection().synchronize();
      });

      it('<400> Should throw validation error', async () => {
        const createFormRes = await request(app)
          .post('/api/v1/forms')
          .send({
            name: 'Form 1',
            fields: [
              {
                name: 'userName',
                type: 'text',
                isRequired: true,
              },
              {
                name: 'email',
                type: 'text',
                isRequired: true,
              },
              {
                name: 'address',
                type: 'text',
                isRequired: false,
              },
            ],
          });
        expect(createFormRes.status).equal(201);
        const createdFormId = createFormRes.body.id;
        const createdForm = await getConnection()
          .getRepository(FormEntity)
          .findOne(createdFormId);
        expect(createdForm!.name).eql('Form 1');
        const fieldRepository = getConnection().getRepository(FieldEntity);
        const notRequiredFields = await fieldRepository.find({
          where: { formId: createdFormId, isRequired: false },
        });
        const collectedDataRes = await request(app)
          .post(`/api/v1/forms/${createdFormId}/collect`)
          .send(
            notRequiredFields.map((e) => ({
              fieldId: e.id,
              data: ['Test data'],
            }))
          );

        expect(collectedDataRes.status).eql(400);
      });
    });

    describe('When passing valid body', () => {
      it('<201> Should collect data successfully', async () => {
        // Create a form to collect data
        const createFormRes = await request(app)
          .post('/api/v1/forms')
          .send({
            name: 'Form 1',
            fields: [
              {
                name: 'userName',
                type: 'text',
                isRequired: true,
              },
              {
                name: 'email',
                type: 'text',
                isRequired: true,
              },
              {
                name: 'address',
                type: 'text',
                isRequired: false,
              },
            ],
          });
        // Expect create form test case
        expect(createFormRes.status).eql(201);
        const createdFormId = createFormRes.body.id;
        const createdForm = await getConnection()
          .getRepository(FormEntity)
          .findOne(createdFormId);
        expect(createdForm!.name).eql('Form 1');

        const fieldRepository = getConnection().getRepository(FieldEntity);
        const createdFields = await fieldRepository.find({
          where: { formId: createdFormId },
        });
        await request(app)
          .post(`/api/v1/forms/${createdFormId}/collect`)
          .send(
            createdFields.map((e) => ({
              fieldId: e.id,
              data: ['Test data'],
            }))
          )
          .expect(201);

        const collectedDataRes = await request(app)
          .get(`/api/v1/forms/${createdFormId}/collected-data`)
          .expect(200);
        // Expect Collect Data test case
        expect(collectedDataRes.status).eql(200);
        expect(collectedDataRes.body).to.deep.equal([
          {
            id: 1,
            formId: createdFormId,
            data: createdFields.map((e) => ({
              value: ['Test data'],
              fieldId: e.id,
              fieldName: e.name,
              type: e.type,
            })),
          },
        ]);
      });
    });
  });
});
