import express from 'express';
import dotenv from 'dotenv';
import baseRouter from './routes';
import logger from '@shared/Logger';
import config from '@config/Config';
import cors from 'cors';

if (process.env.PORT === undefined) {
    let result = dotenv.config({
        path: `./env/default.env`,
    });

    if (result.error) {
        logger.error(`Failed to load default env file: ${result.error}`);
    }
}

const app = express();

app.use(express.json());
app.use(cors(config.corsOptions));
app.use('/api', baseRouter);

// Start the server
const port = Number(process.env.PORT);
app.listen(port, () => {
    logger.info('Express server started on port: ' + port);
});
