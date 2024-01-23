// src/routes/apiRoutes.ts
import express from 'express';

const router = express.Router();

// Define routes
router.get('/data', (req, res) => {
    res.json({ message: 'Hello from the API!' });
});

// ... more routes ...

export default router;
