import express from 'express';

const router = express.Router();

// Root Endpoint
router.get('/', (req, res) => {
  res.status(200).send('Welcome to SSW HR System API server!');
});

router.get('/test', (req, res) => {
  res.status(200).send('TEST');
});

export default router;
