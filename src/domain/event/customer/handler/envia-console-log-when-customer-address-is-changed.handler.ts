import EventHandlerInterface from "../../@shared/event-handler.interface";
import CustomerAddressChangedEvent from "../customer-address-changed.event";

export default class EnviaConsoleLogWhenCustomerAddressIsChangedHandler
    implements EventHandlerInterface<CustomerAddressChangedEvent>
{
    handle(event: CustomerAddressChangedEvent): void {
        console.log(`Sending email 1 when customer is created to...`);
    }
}