import { IRefuel } from '@entities/Refuel';
import dynamodb from '@daos/Database/DynamoDB';
import DynamoDB, { PutItemInput, ScanInput, DeleteItemInput } from 'aws-sdk/clients/dynamodb';
import logger from '@shared/Logger';

const tableName = 'Refuel';

class RefuelDao {
    public async getOne(id: number) {
    }

    public async getAll(): Promise<(IRefuel | null)[]> {
        logger.info("Getting [Refuel] items");

        const params: ScanInput = {
            TableName: tableName,
            Select: 'ALL_ATTRIBUTES',
        };

        let res = (await dynamodb.scan(params).promise()).$response;
        if (res.error) {
            logger.error("Failed to get [Refuel] items, error: " + res.error);
            return [];
        }

        logger.info("Successfully got [Refuel] items, data: " + res.data);
        if (res.data === undefined || res.data.Items == undefined) {
            return [];
        }
        return res.data.Items.map((item) => {
            return this.mapItemToRefuel(item);
        }).filter((item => item !== null));
    }

    public async add(refuel: IRefuel): Promise<IRefuel | null> {
        logger.info("Adding [Refuel] item");
        
        refuel.date = new Date(refuel.date).toISOString();

        const params: PutItemInput = {
            TableName: tableName,
            Item: {
                'id': {
                    S: refuel.id,
                },
                'vehicleNickname': {
                    S: refuel.vehicleNickname,
                },
                'date': {
                    S: refuel.date,
                },
                'gasPrice': {
                    N: refuel.gasPrice.toFixed(1),
                },
                'amountPaid': {
                    N: refuel.amountPaid.toFixed(2),
                },
                'curMileage': {
                    N: refuel.curMileage.toFixed(2),
                },
            }
        };

        let res = (await dynamodb.putItem(params).promise()).$response;
        if (res.error) {
            logger.error("Failed to add [Refuel] item, error: " + res.error);
            return null;
        }

        logger.info("Successfully added [Refuel] item, data: " + res.data);
        return refuel;
    }

    public async deleteOne(id: string): Promise<string | null> {
        logger.info("Deleting [Refuel] item");

        const params: DeleteItemInput = {
            TableName: tableName,
            Key: {
                'id': {
                    S: id,
                }
            }
        };

        let res = (await dynamodb.deleteItem(params).promise()).$response;
        if (res.error) {
            logger.error("Failed to delete [Refuel] item, error: " + res.error);
            return null;
        }

        logger.info("Successfully deleted [Refuel] item, data: " + res.data);
        return id;
    }

    private mapItemToRefuel(item: DynamoDB.AttributeMap): IRefuel | null {
        const id = item.id.S;
        const vehicleNickname = item.vehicleNickname.S;
        const date = item.date.S;
        const gasPrice = Number(item.gasPrice.N);
        const amountPaid = Number(item.amountPaid.N);
        const curMileage = Number(item.curMileage.N);

        if (id === undefined || vehicleNickname == undefined || date == undefined || gasPrice === undefined || amountPaid === undefined || curMileage === undefined) {
            return null;
        }

        return {
            id: id,
            vehicleNickname: vehicleNickname,
            date: date,
            gasPrice: gasPrice,
            amountPaid: amountPaid,
            curMileage: curMileage,
        };
    }
}

export default RefuelDao;