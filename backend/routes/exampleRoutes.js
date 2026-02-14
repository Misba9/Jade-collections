import express from 'express';
import {
  getExamples,
  getExample,
  createExample,
} from '../controllers/exampleController.js';

const router = express.Router();

router.route('/').get(getExamples).post(createExample);
router.route('/:id').get(getExample);

export default router;
