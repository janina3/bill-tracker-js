import { BillModel } from "./bill";
import { PaymentActivityModel } from "./paymentActivity";
import { PaymentMethodModel } from "./paymentMethod";

export class UserModel {
    private readonly _id: number;
    private _name: string;
    private _email: string;
    private _password: string;
    private _bills: Map<number, BillModel>; // key is BillModel id
    private _paymentMethods: Map<number, PaymentMethodModel>;   // key is PaymentMethodModel id
    private _paymentActivity: Map<number, Map<number, Map<number, PaymentActivityModel>>>;   // keys are year, month, MonthlyBillModel id
    private _isActive: boolean;
    private _createdDate: Date;
    private _deactivatedDate?: Date;

    constructor (
        id: number,
        name: string,
        email: string,
        password: string
    ){
        this._id = id;
        this._name = name;
        this._email = email;
        this._password = password;
        this._bills = new Map<number, BillModel>;
        this._paymentMethods = new Map<number, PaymentMethodModel>;
        this._paymentActivity = new Map<number, Map<number, Map<number, PaymentActivityModel>>>;
        this._isActive = true;
        this._createdDate = new Date();
    }

    // Getters
    get id(): number {
        return this._id;
    }

    get name(): string {
        return this._name;
    }

    get email(): string {
        return this._email;
    }

    get password(): string {
        return this._password;
    }

    get bills(): Map<number, BillModel> {
        return this._bills;
    }

    get paymentMethods(): Map<number, PaymentMethodModel> {
        return this._paymentMethods;
    }

    get paymentActivity(): Map<number, Map<number, Map<number, PaymentActivityModel>>> {
        return this._paymentActivity;
    }

    get isActive(): boolean {
        return this._isActive;
    }

    get createdDate(): Date {
        return this._createdDate;
    }

    get deactivatedDate(): Date | undefined {
        if (!this._deactivatedDate) {
            console.error('Monthly Bill ${this._id} is still active');
        }
        
        return this._deactivatedDate;
    }

    // Setters
    
    // Adders
    // Add Bill
    public addBill(newBill: BillModel): boolean {
        let success = false;
        if (!newBill) {
            console.error('New Bill cannot be empty');
        } else if (newBill && this._bills.has(newBill.id)) {
            console.error('New Bill ${newBill.id} already exists for ${this._id}');
        } else if (newBill.isRecurring) {   // If it's a recurring bill, add to the Map of bills
            this._bills.set(newBill.id, newBill);
            console.log('New Bill ${newBill.id} has been added for ${this._id}');
            success = true;
        } else {    // If it is not a recurring bill, add directly to the payment activity
            const results = this.addPaymentActivity(newBill);
        }
        
        return success;
    }

    // Add Payment Method
    public addPaymentMethod(newPaymentMethod: PaymentMethodModel): boolean {
        let success = false;
        if (!newPaymentMethod) {
            console.error('New Payment Method cannot be empty');
        } else if (newPaymentMethod && this._paymentMethods.has(newPaymentMethod.id)) {
            console.error('New Payment Method ${newPaymentMethod.id} already exists for ${this._id}');
        } else {
            this._paymentMethods.set(newPaymentMethod.id, newPaymentMethod);
            console.log('New Payment Method ${newPaymentMethod.id} has been added for ${this._id}');
            success = true;
        }
        
        return success;
    }

    // Generate the bills due this month
    public generateMonthly(): boolean {
        let success = false;
        return success;
    }

    // Add Payment Activity
    private addPaymentActivity(newBill: BillModel): boolean {
        let success = false;
        let id: number = this.generateRandomId();
        newBill.month = newBill.month || new Date().getMonth();
        newBill.year = newBill.year || new Date().getFullYear();

        // Generate a new ID if the ID already exists in that year and month maps
        if (this._paymentActivity.has(newBill.year)) {
            if (this._paymentActivity.get(newBill.year)?.has(newBill.month)) {
                // While there is an instance for the random id, generate a new ID
                while (this._paymentActivity.get(newBill.year)?.get(newBill.month)?.has(id)) {
                    id = this.generateRandomId();
                }
            }
        }

        const newPaymentActivity: PaymentActivityModel = this.createPaymentActivityModel(newBill);

        return this.updateYearMapEntry(newPaymentActivity);
    }

    // Create a PaymentActivityModel, given a BillModel
    private createPaymentActivityModel(bill: BillModel, month?: number, year?: number): PaymentActivityModel {
        const newPaymentActivity: PaymentActivityModel = new PaymentActivityModel(
            bill.id,
            bill.userId,
            bill.name,
            bill.day,
            bill.month || month || new Date().getMonth(),
            bill.year || year || new Date().getFullYear(),
            bill.amountDue
        );

        return newPaymentActivity;
    }

    //  Create an entry for paymentActivity. Key is month, value is MonthlyBillModel
    private updateYearMapEntry(paymentActivity: PaymentActivityModel): boolean {
        let success = false;
        const monthEntry: Map<number, Map<number, PaymentActivityModel>> = new Map<number, Map<number, PaymentActivityModel>>;  //  key: month, value: payment map
        const paymentEntry: Map<number, PaymentActivityModel> = new Map<number, PaymentActivityModel>;  //  key: payment id, value: payment
        paymentEntry.set(paymentActivity.id, paymentActivity);
        monthEntry.set(paymentActivity.month, paymentEntry);
        if (this._paymentActivity.set(paymentActivity.year, monthEntry)) {  // key: year, value: month map
            success = true;
        }

        return success    
    }

    private generateRandomId(): number {
        return Math.floor(Math.random() * 90000) + 10000;
    }

    // Pay bill


    // Deactivate User
    public deactivateUser() {
        this._isActive = false;
        this._deactivatedDate = new Date();
        console.log('Deactivated user ${this._id} on ${this._deactivatedDate}');
    }
}