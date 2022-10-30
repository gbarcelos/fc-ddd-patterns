import Product from "./product";

describe("Product unit tests", () => {

    it("should throw error when id is empty", () => {
        expect(() => {
            let product = new Product("", "123", 100);
        }).toThrowError("Id is required");
    });

    it("should throw error when name is empty", () => {
        expect(() => {
            let product = new Product("id123", "", 100);
        }).toThrowError("Name is required");
    });

    it("should throw error when price is less than zero", () => {
        expect(() => {
            let product = new Product("id123", "123", -1);
        }).toThrowError("Price must be greater thna zero");
    });

    it("should change name", () => {
        // Arrange
        const product = new Product("id123", "product123", 100);

        // Act
        product.changeName("product456");

        // Assert
        expect(product.name).toBe("product456");
    });

    it("should change price", () => {
        // Arrange
        const product = new Product("id123", "product123", 100);

        // Act
        product.changePrice(200);

        // Assert
        expect(product.price).toBe(200);
    });
});