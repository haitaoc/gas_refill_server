import { Router } from 'express';
import userRouter from './Users';

// Init router and path
const router = Router();

// Add sub-routes
//router.use('/users', UserRouter);
router.use('/users', userRouter);

router.get('/', () => {
    console.log("get root");
});

// Export the base-router
export default router;
