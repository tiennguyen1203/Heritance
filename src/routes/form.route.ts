import { Router } from 'express';
import { makeValidateBody } from 'express-class-validator';
import { FormController } from '../controller/form.controller';
import { CollectDataDto } from '../validators/collected-data';

const formController = new FormController();
const router = Router();

const createFormRouter = router.post('/', formController.create);
const getForms = router.get('/', formController.getList);
const getFormDetailsRouter = router.get('/:id', formController.getFormDetails);
const collectDataRouter = router.post(
  '/:id/collect',
  makeValidateBody(CollectDataDto),
  formController.collectData
);
const getCollectedDataRouter = router.get(
  '/:id/collected-data',
  formController.getCollectedDataById
);

router.use([
  createFormRouter,
  getForms,
  getFormDetailsRouter,
  collectDataRouter,
  getCollectedDataRouter,
]);

export { router as formRoutes };
