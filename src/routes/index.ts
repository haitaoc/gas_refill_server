import { Router } from 'express';
import refuelRecordRouter from './Refuel';

// Init router and path
const router = Router();

// Add sub-routes
//router.use('/users', UserRouter);
router.use('/refuels', refuelRecordRouter);

router.get('/', () => {
    console.log("get root");
});

// Export the base-router
export default router;
