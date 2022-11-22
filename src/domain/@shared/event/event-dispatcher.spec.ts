import Customer from "../../customer/entity/customer";
import CustomerAddressChangedEvent from "../../customer/event/customer-address-changed.event";
import CustomerCreatedEvent from "../../customer/event/customer-created.event";
import EnviaConsoleLogWhenCustomerAddressIsChangedHandler from "../../customer/event/handler/envia-console-log-when-customer-address-is-changed.handler";
import EnviaConsoleLog1WhenCustomerIsCreatedHandler from "../../customer/event/handler/envia-console-log1-when-customer-is-created.handler";
import EnviaConsoleLog2WhenCustomerIsCreatedHandler from "../../customer/event/handler/envia-console-log2-when-customer-is-created.handler";
import Address from "../../customer/value-object/address";
import SendEmailWhenProductIsCreatedHandler from "../../product/event/handler/send-email-when-product-is-created.handler";
import ProductCreatedEvent from "../../product/event/product-created.event";
import EventDispatcher from "./event-dispatcher";



describe("Domain events tests", () => {

    it("should register an event handler", () => {

        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenProductIsCreatedHandler();

        eventDispatcher.register("ProductCreatedEvent", eventHandler);

        expect(
            eventDispatcher.getEventHandlers["ProductCreatedEvent"]
        ).toBeDefined();

        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(
            1
        );

        expect(
            eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
        ).toMatchObject(eventHandler);
    });

    it("should unregister an event handler", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenProductIsCreatedHandler();

        eventDispatcher.register("ProductCreatedEvent", eventHandler);

        expect(
            eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
        ).toMatchObject(eventHandler);

        eventDispatcher.unregister("ProductCreatedEvent", eventHandler);

        expect(
            eventDispatcher.getEventHandlers["ProductCreatedEvent"]
        ).toBeDefined();
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(
            0
        );
    });

    it("should unregister all event handlers", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenProductIsCreatedHandler();

        eventDispatcher.register("ProductCreatedEvent", eventHandler);

        expect(
            eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
        ).toMatchObject(eventHandler);

        eventDispatcher.unregisterAll();

        expect(
            eventDispatcher.getEventHandlers["ProductCreatedEvent"]
        ).toBeUndefined();
    });

    it("should notify all event handlers", () => {

        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenProductIsCreatedHandler();

        // verifica se esse eventhandler executa o método handle
        const spyEventHandler = jest.spyOn(eventHandler, "handle");

        eventDispatcher.register("ProductCreatedEvent", eventHandler);

        expect(
            eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
        ).toMatchObject(eventHandler);

        const productCreatedEvent = new ProductCreatedEvent({
            name: "Product 1",
            description: "Product 1 description",
            price: 10.0,
        });

        // Quando o notify for executado o SendEmailWhenProductIsCreatedHandler.handle() deve ser chamado
        eventDispatcher.notify(productCreatedEvent);

        expect(spyEventHandler).toHaveBeenCalled();
    });

    it("should notify all customer event handlers", () => {

        const eventDispatcher = new EventDispatcher();

        const eventHandlerCreateCustomerLog1 = new EnviaConsoleLog1WhenCustomerIsCreatedHandler();
        const eventHandlerCreateCustomerLog2 = new EnviaConsoleLog2WhenCustomerIsCreatedHandler();

        const eventHandlerChangeAddress = new EnviaConsoleLogWhenCustomerAddressIsChangedHandler();

        const spyEntHandlerCreateCustomerLog1 = jest.spyOn(eventHandlerCreateCustomerLog1, "handle");
        const spyEntHandlerCreateCustomerLog2 = jest.spyOn(eventHandlerCreateCustomerLog2, "handle");
        const spyEventHandlerChangeAddress = jest.spyOn(eventHandlerChangeAddress, "handle");

        eventDispatcher.register("CustomerCreatedEvent", eventHandlerCreateCustomerLog1);
        eventDispatcher.register("CustomerCreatedEvent", eventHandlerCreateCustomerLog2);
        eventDispatcher.register("CustomerAddressChangedEvent", eventHandlerChangeAddress);

        expect(
            eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]
        ).toMatchObject(eventHandlerCreateCustomerLog1);

        expect(
            eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]
        ).toMatchObject(eventHandlerCreateCustomerLog2);

        expect(
            eventDispatcher.getEventHandlers["CustomerAddressChangedEvent"][0]
        ).toMatchObject(eventHandlerChangeAddress);

        // Customer created
        const customer = new Customer("123", "Customer 1");
        customer.Address = new Address("Street 1", 123, "13330-250", "São Paulo");
        eventDispatcher.notify(new CustomerCreatedEvent(customer));

        expect(spyEntHandlerCreateCustomerLog1).toHaveBeenCalled();
        expect(spyEntHandlerCreateCustomerLog2).toHaveBeenCalled();

        // Customer address changed
        customer.changeAddress(new Address("Street 1", 1, "Zipcode 1", "City 1"));
        const customerAddressChangedEvent = new CustomerAddressChangedEvent(customer);
        eventDispatcher.notify(customerAddressChangedEvent);
        
        expect(spyEventHandlerChangeAddress).toHaveBeenCalled();
    });
});