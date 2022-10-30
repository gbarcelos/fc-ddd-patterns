import Order from "./order";
import OrderItem from "./order_item"

describe("Order unit tests", () => {

    it("should throw error when id is empty", () => {
        expect(() => {
            let order = new Order("", "123", [new OrderItem("id1", "item1", 100, "p1", 2)]);
        }).toThrowError("Id is required");
    });

    it("should throw error when customerId is empty", () => {
        expect(() => {
            let order = new Order("123", "", [new OrderItem("id1", "item1", 100, "p1", 2)]);
        }).toThrowError("CustomerId is required");
    });

    it("should throw error when item qtd is zero", () => {
        expect(() => {
            let order = new Order("123", "123", []);
        }).toThrowError("Items are required");
    });

    it("should calculate total", () => {

        const item1 = new OrderItem("id1", "item1", 100, "p1", 2);
        const item2 = new OrderItem("id1", "item1", 200, "p2", 2);

        const order1 = new Order("o1", "c1", [item1]);

        let total = order1.total;

        expect(total).toBe(200);

        const order2 = new Order("o1", "c1", [item1, item2]);
        total = order2.total;

        expect(total).toBe(600);
    });

    it("should throw error when the item qtd is less or equal to zero", () => {
        expect(() => {
            const item1 = new OrderItem("id1", "item1", 100, "p1", 0);
            const order1 = new Order("o1", "c1", [item1]);
        }).toThrowError("Quantity must be greater than zero");
    });
});