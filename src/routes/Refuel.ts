import { Request, Response, Router } from 'express';
import { BAD_REQUEST, CREATED, OK } from 'http-status-codes';
import { ParamsDictionary } from 'express-serve-static-core';
import RefuelDao from '@daos/Refuel/RefuelDao';
import logger from '@shared/Logger';
import Refuel, { IRefuel } from '@entities/Refuel';

const router = Router();
const refuelDao = new RefuelDao();

router.get('/', async (req: Request, res: Response) => {
    logger.info("Handle GET Refuel request");
    try { 
        const ret = await refuelDao.getAll();

        if (ret === null) {
            return res.status(BAD_REQUEST);
        }
        return res.status(OK).json(ret);
    } catch(err) {
        logger.error(err.message, err);
        return res.status(BAD_REQUEST).json({
            error: err.message,
        });
    }
});

router.post('/', async (req: Request, res: Response) => {
    logger.info("Handle POST Refuel request");
    try {
        const jsonData = req.body;
        let refuel = new Refuel(null, jsonData.vehicleNickname, jsonData.date, jsonData.gasPrice, jsonData.amountPaid, jsonData.curMileage);
        
        const ret = await refuelDao.add(refuel);

        if (ret === null) {
            return res.status(BAD_REQUEST);
        }
        return res.status(OK).json(ret);
    } catch(err) {
        logger.error(err.message, err);
        return res.status(BAD_REQUEST).json({
            error: err.message,
        });
    }
});

//router.put();

router.delete('/:id', async (req: Request, res: Response) => {
    logger.info("Handle POST Refuel request");

    const id = req.params.id;
    try {
        const ret = await refuelDao.deleteOne(id);

        if (ret === null) {
            return res.status(BAD_REQUEST);
        }
        return res.status(OK).json(ret);
    } catch(err) {
        logger.error(err.message, err);
        return res.status(BAD_REQUEST).json({
            error: err.message,
        });
    }
});

export default router;