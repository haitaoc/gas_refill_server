import { Request, Response, Router } from 'express';
import { BAD_REQUEST, CREATED, OK } from 'http-status-codes';
import RefuelDao from '@daos/Refuel/RefuelDao';
import logger from '@shared/Logger';
import Refuel, { IRefuel } from '@entities/Refuel';

const router = Router();
const refuelDao = new RefuelDao();

router.get('/:username/refuels', async (req: Request, res: Response) => {
    const username = req.params.username;

    logger.info(`GET Refuels for user [${username}]`);

    try { 
        const ret = await refuelDao.getAllForUser(username);

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

router.post('/:username/vehicles/:vehicleId/refuels', async (req: Request, res: Response) => {
    const {
        username,
        vehicleId
    } = req.params;

    logger.info(`POST Refuel for user [${username}]'s vehicle [${vehicleId}]`);
    try {
        const jsonData = req.body;
        let refuel = new Refuel(username, vehicleId, jsonData.date, jsonData.gasPrice, jsonData.amountPaid, jsonData.curMileage);
        
        const ret = await refuelDao.addOne(refuel);

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