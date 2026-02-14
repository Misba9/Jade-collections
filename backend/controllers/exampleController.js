import Example from '../models/Example.js';

/**
 * @desc    Get all examples
 * @route   GET /api/examples
 * @access  Public
 */
export const getExamples = async (req, res, next) => {
  try {
    const examples = await Example.find();
    res.status(200).json({
      success: true,
      count: examples.length,
      data: examples,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single example
 * @route   GET /api/examples/:id
 * @access  Public
 */
export const getExample = async (req, res, next) => {
  try {
    const example = await Example.findById(req.params.id);
    if (!example) {
      const error = new Error('Resource not found');
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({
      success: true,
      data: example,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create example
 * @route   POST /api/examples
 * @access  Public
 */
export const createExample = async (req, res, next) => {
  try {
    const example = await Example.create(req.body);
    res.status(201).json({
      success: true,
      data: example,
    });
  } catch (error) {
    next(error);
  }
};
