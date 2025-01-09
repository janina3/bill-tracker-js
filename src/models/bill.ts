export class BillModel {
    private _id: number;
    private _userId: number;
    private _name: string;
    private _isRecurring: boolean;
    private _day: number;
    private _month?: number;
    private _year?: number;
    private _amountDue: number;
    private _isActive: boolean;
    private _createdDate: Date;
    private _deactivatedDate?: Date;

    constructor (
        id: number,
        userId: number,
        name: string,
        isRecurring: boolean,
        day: number,
        amountDue: number,
        month?: number,
        year?: number
    ){
        this._id = id;
        this._userId = userId;
        this._name = name;
        this._isRecurring = isRecurring;
        this._day = day;
        this._amountDue = amountDue;
        this._isActive = true;
        this._createdDate = new Date();
        this._month = month;
        this._year = year;
    }

    // Getters
    get id(): number {
        return this._id;
    }

    get userId(): number {
        return this._userId;
    }

    get name(): string {
        return this._name;
    }

    get isRecurring(): boolean {
        return this._isRecurring;
    }

    get day(): number {
        return this._day;
    }

    get month(): number | undefined {
        return this._month;
    }

    get year(): number | undefined {
        return this._year;
    }

    get amountDue(): number {
        return this._amountDue;
    }
    
    get isActive(): boolean {
        return this._isActive;
    }

    get createdDate(): Date {
        return this._createdDate;
    }

    get deactivatedDate(): Date | undefined {
        if (!this._deactivatedDate) {
            console.error('bill ${this._id} is still active');
        }

        return this._deactivatedDate;
    }

    // Setters
    set month(month: number) {
        this._month = month;
    }

    set year(year: number) {
        this._year = year;
    }

    // Deactivate Bill
    public deactivateBill() {
        this._isActive = false;
        this._deactivatedDate = new Date();
        console.log('Deactivated bill ${this._id} on ${this._deactivatedDate}');
    }
}