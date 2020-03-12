import { uuid, isUuid } from 'uuidv4';

export interface IRefuel {
    username: string;
    vehicleId: string;
    date: string;
    gasPrice: number;
    amountPaid: number;
    curMileage: number;
}

class Refuel implements IRefuel {
    username: string;
    vehicleId: string;
    date: string;
    gasPrice: number;
    amountPaid: number;
    curMileage: number;

    constructor(username: string, vehicleNickname: string, date: string, gasPrice: number, amountPaid: number, curMileage: number) {
        this.username = username;
        this.vehicleId = vehicleNickname;
        this.date = date;
        this.gasPrice = gasPrice;
        this.amountPaid = amountPaid;
        this.curMileage = curMileage;
    }
}

export default Refuel;
