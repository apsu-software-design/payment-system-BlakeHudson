
import * as payment_systems from './payment_systems';

/**
 * selects the appropriate payment system to execute based on input passed.
 * @param type string with name of payment type to build
 * @returns appropriate PaymentSystemEXecuter object matching the input, otherwise undefined if not found.
 */
 export function paymentStrategy(type: string): payment_systems.PaymentSystemExecutor|undefined{
    let paymentMethod: payment_systems.PaymentSystem;
    if(type === "creditcard"){
        let paymentMethod = new payment_systems.CreditCardSystem();
        paymentMethod.build();
        return paymentMethod.getExecuter();
    }
    if(type === "bankdraft"){
        let paymentMethod = new payment_systems.BankDraft();
        paymentMethod.build();
        return paymentMethod.getExecuter();
    }
    if(type === "online"){
        let paymentMethod = new payment_systems.OnlinePayment();
        paymentMethod.build();
        return paymentMethod.getExecuter();
    }
    if(type === "offline"){
        let paymentMethod = new payment_systems.OfflinePayment();
        paymentMethod.build();
        return paymentMethod.getExecuter();
    }else{
        return undefined;
    }
}