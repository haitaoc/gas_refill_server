import express from 'express';
import baseRouter from './routes';
import logger from '@shared/Logger';
import config from 'config/Config';
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(cors(config.corsOptions));
app.use('/api', baseRouter);

// Start the server
const port = Number(config.server.port);
app.listen(port, () => {
    logger.info('Express server started on port: ' + port);
});
