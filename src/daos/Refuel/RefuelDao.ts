import { IRefuel } from '@entities/Refuel';
import dynamodb from '@daos/Database/DynamoDB';
import DynamoDB, { PutItemInput, DeleteItemInput, QueryInput } from 'aws-sdk/clients/dynamodb';
import logger from '@shared/Logger';

const tableName = 'RefuelApp';

class RefuelDao {
    public async getOne(id: number) {
    }

    public async getAllForUser(username: string): Promise<(IRefuel | null)[]> {
        logger.info("Getting [Refuel] items");

        const params: QueryInput = {
            TableName: tableName,
            Select: 'ALL_ATTRIBUTES',
            KeyConditionExpression: 'pk = :pkValue',
            ExpressionAttributeValues: {
                ':pkValue': {S: this.getPartitionKey(username)}
            }
        };

        let res = (await dynamodb.query(params).promise()).$response;
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

    public async addOne(refuel: IRefuel): Promise<IRefuel | null> {
        logger.info("Adding [Refuel] item: " + refuel);

        refuel.date = new Date(refuel.date).toISOString();

        const params: PutItemInput = {
            TableName: tableName,
            Item: {
                'pk': {S: this.createPartitionKey(refuel)},
                'sk': {S: this.createSortKey(refuel)},
                'username': {S: refuel.username},
                'vehicleId': {S: refuel.vehicleId},
                'date': {S: refuel.date},
                'gasPrice': {N: refuel.gasPrice.toFixed(1)},
                'amountPaid': {N: refuel.amountPaid.toFixed(2)},
                'curMileage': {N: refuel.curMileage.toFixed(2)},
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

    private createPartitionKey(refuel: IRefuel): string {
        return `Refuel:${refuel.username}`;
    }

    private getPartitionKey(username: string): string {
        return `Refuel:${username}`;
    }

    private createSortKey(refuel: IRefuel): string {
        return `${refuel.vehicleId}_${refuel.date}`;
    }

    private mapItemToRefuel(item: DynamoDB.AttributeMap): IRefuel | null {
        const username = item.username.S;
        const vehicleId = item.vehicleId.S;
        const date = item.date.S;
        const gasPrice = Number(item.gasPrice.N);
        const amountPaid = Number(item.amountPaid.N);
        const curMileage = Number(item.curMileage.N);

        if (username === undefined
            || vehicleId === undefined
            || date === undefined
            || gasPrice === undefined
            || amountPaid === undefined
            || curMileage === undefined) {
            return null;
        }

        return {
            username: username,
            vehicleId: vehicleId,
            date: date,
            gasPrice: gasPrice,
            amountPaid: amountPaid,
            curMileage: curMileage,
        };
    }
}

export default RefuelDao;