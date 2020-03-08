import { DynamoDB } from 'aws-sdk/clients/all';
import config from  'config/Config';

const {
    accessId,
    accessKey,
    region
} = config.database.dynamodb;

const dynamodb = new DynamoDB({
    accessKeyId: accessId,
    secretAccessKey: accessKey,
    region: region,
});

export default dynamodb;