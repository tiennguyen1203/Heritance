import { Router } from 'express';
import { FormController } from '../controller/form.controller';

const formController = new FormController();
const router = Router();

const createFormRouter = router.post('/', formController.create);
const getForms = router.get('/', formController.getList);
const getFormDetailsRouter = router.get('/:id', formController.getFormDetails);
const collectDataRouter = router.post(
  '/:id/collect',
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
