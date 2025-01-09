class Payment {
    private _datePaid: Date;
    private _amountPaid: number;
    private _confirmationNumber: number;

    constructor (
        datePaid: Date,
        amountPaid: number,
        confirmationNumber: number
    ){
        this._datePaid = datePaid;
        this._amountPaid = amountPaid;
        this._confirmationNumber = confirmationNumber;
    }
}

export class PaymentActivityModel {
    private readonly _id: number;
    private _userId: number;
    private _paymentMethodId: number;
    private _name: string;
    private _dueDate: Date;
    private _month: number;
    private _year: number;
    private _fullyPaid: boolean;
    private _amountDue: number;
    private _remainingBalance: number;
    private _payments: Map<number, Payment>;
    private _isActive: boolean;
    private _createdDate: Date;
    private _deactivatedDate?: Date;

    constructor (
        id: number,
        userId: number,
        name: string,
        day: number,
        month: number,
        year: number,
        amountDue: number
    ){
        this._id = id;
        this._userId = userId;
        this._paymentMethodId = 0;
        this._name = name;
        this._month = month;
        this._year = year;
        this._dueDate = this.createDate(day, month, year);
        this._fullyPaid = false;
        this._amountDue = amountDue;
        this._remainingBalance = amountDue;
        this._payments = new Map<number, Payment>;
        this._isActive = true;
        this._createdDate = new Date();
    }

    // Getters
    get id(): number {
        return this._id;
    }

    get userId(): number {
        return this._userId;
    }

    get paymentMethodId(): number {
        return this._paymentMethodId;
    }

    get name(): string {
        return this._name;
    }

    get month(): number {
        return this._month;
    }

    get year(): number {
        return this._year;
    }

    get dueDate(): Date {
        return this._dueDate;
    }

    get fullyPaid(): boolean {
        return this._fullyPaid;
    }

    get remainingBalance(): number {
        return this._remainingBalance;
    }

    get amountDue(): number {
        return this._amountDue;
    }

    get payments(): Map<number, Payment> {
        return this._payments;
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

    // Pay Bill
    public payBill(confirmationNumber: number, amountPaid: number, date: Date | null): PaymentActivityModel {
        if (!this._payments.has(confirmationNumber)) {
            // Calculate date paid
            if (!date) {
                date = new Date();
            }

            // Create new payment object
            const payment = new Payment(date, amountPaid, confirmationNumber);
            this._payments.set(confirmationNumber, payment);

            // Calculate payment amounts
            this._remainingBalance = this.remainingBalance - amountPaid;
            if (this._remainingBalance <= 0) {
                this._fullyPaid = true;
            }

        } else {
            console.error('Payment ${confirmationNumber} has already been added');
        }

        return this;
    }

    // Create Date
    private createDate(day: number, month: number, year: number) {
        return new Date(year, month - 1, day);
    }

    // Deactivate Bill
    public deactivateBill() {
        this._isActive = false;
        this._deactivatedDate = new Date();
        console.log('Deactivated bill ${this._id} on ${this._deactivatedDate}');
    }
}