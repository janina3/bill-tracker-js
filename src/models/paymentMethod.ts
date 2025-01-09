export class PaymentMethodModel {
    constructor (
        public id: number,
        public userId: number,
        public name: string,
        public type: string,
        public isActive: boolean,
        public createdDate: Date = new Date()
    ){}
}