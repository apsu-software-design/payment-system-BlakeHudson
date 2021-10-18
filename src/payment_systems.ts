import readlineSync = require('readline-sync'); //for easier repeated prompts

/**
 *  The PaymentSystemExecutor class is really a factory class
 *  that does the workflow steps outlined (read in data, validate it, encrypt it, and process it).
 *  It requires two functions to be passed to the constructor
 *  One to ask the user for the payment information needed for the specific payment type
 *  Another to validate the information collected in the first function
 */
export class PaymentSystemExecutor {
    private gatherInfo: () => { [key: string]: string };
    private validate: (inputs: { [key: string]: string }) => boolean;

    public constructor(inputs: () => { [key: string]: string }, validate: (inputs: { [key: string]: string }) => boolean) {
        this.gatherInfo = inputs;
        this.validate = validate;
    }

    //execute() steps through the payment process workflow and prints the relevant information to the screen.
    execute(){
        let valid = this.validate(this.gatherInfo());

        if (valid) {
            console.log("Your payment information is being encrypted.");
      
            console.log("The payment is being processed.")
        }
        else {
            console.log('The payment is invalid.');
        }
    }
}

/**
 * Abstract class for deriving a payment system method
 * creates a PaymentSytemExecuter object with the two required functions to be implemented by the child class
 */
export abstract class PaymentSystem{
   private payExec!: PaymentSystemExecutor;
   abstract gatherInfo: () => { [key: string]: string };
   abstract validatePayment: (inputs: { [key: string]: string }) => boolean;

    /**
     * builds a PaymentSystemExecuter object with paymentsystem specific methods passed to constructor
     */
    build(): void {
        this.payExec = new PaymentSystemExecutor(this.gatherInfo, this.validatePayment);
    }
    /**
     * returns the created PaymentSystemExecuter object
     * @returns 
     */
    getExecuter(): PaymentSystemExecutor {
        return this.payExec;
    }
}

/**
 * Builds a PaymentSystemExecuter object with the required functions for Credit Card processing
 */
export class CreditCardSystem extends PaymentSystem {
    gatherInfo: () => { [key: string]: string };
    validatePayment: (inputs: { [key: string]: string }) => boolean;
    constructor(){
        super();
        this.gatherInfo = this.paymentInfo;
        this.validatePayment = this.validate;
    }
    /**
     * prompts for and returns a key/value pair object of customer payment info
     * @returns credit card payment information
     */
    paymentInfo(): { [key: string]: string } {
        let inputs: { [key: string]: string } = {};
        console.log('Enter Credit Card Payment Details.');
        inputs['name'] = readlineSync.question('  Name: ');
        inputs['creditCardNumber'] = readlineSync.question('  Credit Card Number: ');
        inputs['creditCardExpirationDate'] = readlineSync.question('  Credit Card Expiration Date (MM/DD): ');
        return inputs;
    }
    /**
     * validates user input for a credit card payment
     * @param inputs key/value pairs of payment information
     * @returns true if payment information is valid for a credit card
     */
    validate(inputs: { [key: string]: string }): boolean {
        let valid = /^[\w.' ]+$/.test(inputs.name) && /\d{15,16}/.test(inputs.creditCardNumber) && /\d\d\/\d\d/.test(inputs.creditCardExpirationDate);
        if (valid) {
            return true;
        } else {
            return false;
        }
    }
}

/**
 *  Builds a PaymentSystemExecuter object with the required functions for Bank Draft processing
 */
export class BankDraft extends PaymentSystem {
    gatherInfo: () => { [key: string]: string };
    validatePayment: (inputs: { [key: string]: string }) => boolean;
    constructor(){
        super();
        this.gatherInfo = this.paymentInfo;
        this.validatePayment = this.validate;
    }
    /**
     * prompts for and returns a key/value pair object of customer payment info
     * @returns key/value pair of user information as values and expected fields as keys
     */
    paymentInfo(): { [key: string]: string; } {
        let inputs: { [key: string]: string } = {};
        console.log('Enter Bank Account Details.');
        inputs['name'] = readlineSync.question('  Name: ');
        inputs['bankRoutingNumber'] = readlineSync.question('  Bank Routing Number: ');
        inputs['bankAccountNumber'] = readlineSync.question('  Bank Account Number: ');
        return inputs;
    }
    /**
     * validates user input information for an offline payment 
     * @param inputs key/value pair of user information as values and expected fields as keys
     * @returns true if input is valid for an bank draft payment
     */
    validate(inputs: { [key: string]: string; }): boolean {
        let valid = /^[\w.' ]+$/.test(inputs.name) && /\d{9}/.test(inputs.bankRoutingNumber) && /\d{6,12}/.test(inputs.bankAccountNumber);
        if (valid) {
            return true;
        } else {
            return false;
        }
    }
}

/**
 *  Builds a PaymentSystemExecuter object with the required functions for online payment processing
 */
export class OnlinePayment extends PaymentSystem {
    gatherInfo: () => { [key: string]: string };
    validatePayment: (inputs: { [key: string]: string }) => boolean;
    constructor(){
        super();
        this.gatherInfo = this.paymentInfo;
        this.validatePayment = this.validate;
    }
    /**
     * prompts for and returns a key/value pair object of customer payment info
     * @returns key/value pair of user information as values and expected fields as keys
     */
    paymentInfo(): { [key: string]: string; } {
        let inputs: { [key: string]: string } = {};
        console.log('Enter Online Payment Details.');
        inputs['email'] = readlineSync.question('  Enter Your Email Address: ');
        inputs['paymentPassword'] = readlineSync.question('  Enter Your Payment Password: ');
        return inputs;
    }
    /**
     * validates user input information for an offline payment 
     * @param inputs key/value pair of user information as values and expected fields as keys
     * @returns true if input is valid for an online payment
     */
    validate(inputs: { [key: string]: string; }): boolean {
        let valid = /^[\w@.]+$/.test(inputs.email) && /\w+/.test(inputs.paymentPassword);
        if (valid) {
            return true;
        } else {
            return false;
        }
    }
}

/**
 * Builds a PaymentSystemExecuter object with the required functions for offline payment processing
 */
export class OfflinePayment extends PaymentSystem {
    gatherInfo: () => { [key: string]: string };
    validatePayment: (inputs: { [key: string]: string }) => boolean;
    constructor(){
        super();
        this.gatherInfo = this.paymentInfo;
        this.validatePayment = this.validate;
    }
    /**
     * prompts for and returns a key/value pair object of customer payment info
     * @returns key/value pair of user information as values and expected fields as keys
     */
    paymentInfo(): { [key: string]: string; } {
        let inputs: { [key: string]: string } = {};
        console.log('Enter Offline Payment Details.');
        inputs['name'] = readlineSync.question('  Name: ');
        inputs['billingAddress'] = readlineSync.question('  Enter Your Billing Address: ');
        return inputs;
    }
    /**
     * validates user input information for an offline payment 
     * @param inputs key/value pair of user information as values and expected fields as keys
     * @returns true if input is valid for an offline payment
     */
    validate(inputs: { [key: string]: string; }): boolean {
        let valid = /^[\w.' ]+$/.test(inputs.name) && /^[\w.' ]+$/.test(inputs.billingAddress);
        if (valid) {
            return true;
        } else {
            return false;
        }
    }
}


