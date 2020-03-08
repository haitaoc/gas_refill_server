import { uuid, isUuid } from 'uuidv4';

export interface IRefuel {
    id: string;
    vehicleNickname: string;
    date: string;
    gasPrice: number;
    amountPaid: number;
    curMileage: number;
}

class Refuel implements IRefuel {
    id: string;
    vehicleNickname: string;
    date: string;
    gasPrice: number;
    amountPaid: number;
    curMileage: number;

    constructor(id: string | null, vehicleNickname: string, date: string, gasPrice: number, amountPaid: number, curMileage: number) {
        if (id == null) {
            this.id = uuid();
        } else if (isUuid(id)) {
            this.id = id;
        } else {
            throw "Refuel id [${id}] is not in uuid format";
        }
        this.vehicleNickname = vehicleNickname;
        this.date = date;
        this.gasPrice = gasPrice;
        this.amountPaid = amountPaid;
        this.curMileage = curMileage;
    }
}

export default Refuel;
