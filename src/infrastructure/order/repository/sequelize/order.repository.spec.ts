import { Sequelize } from "sequelize-typescript";

import Address from "../../../../domain/customer/value-object/address";
import CustomerModel from "../../../customer/repository/sequelize/customer.model";
import OrderItemModel from "./order-item.model";
import ProductModel from "../../../product/repository/sequelize/product.model";
import OrderRepository from "./order.repository";
import OrderModel from "./order.model";
import Customer from "../../../../domain/customer/entity/customer";
import CustomerRepository from "../../../customer/repository/sequelize/customer.repository";
import ProductRepository from "../../../product/repository/sequelize/product.repository";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import Product from "../../../../domain/product/entity/product";
import Order from "../../../../domain/checkout/entity/order";

describe("Order repository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([
      CustomerModel,
      OrderModel,
      OrderItemModel,
      ProductModel,
    ]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a new order", async () => {

    // Create a customer
    const customer = new Customer("123", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);

    const customerRepository = new CustomerRepository();
    await customerRepository.create(customer);

    // Create a product
    const product = new Product("123", "Product 1", 10);

    const productRepository = new ProductRepository();
    await productRepository.create(product);

    // Create a order
    const ordemItem = new OrderItem(
      "1",
      product.name,
      product.price,
      product.id,
      2
    );
    const order = new Order("123", "123", [ordemItem]);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    // Get the order from database
    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"]
    });

    expect(orderModel.toJSON()).toStrictEqual({
      id: "123",
      customer_id: "123",
      total: order.total,
      items: [
        {
          id: ordemItem.id,
          name: ordemItem.name,
          price: ordemItem.price,
          quantity: ordemItem.quantity,
          order_id: "123",
          product_id: "123"
        }
      ]
    });
  });

  it("should change the product quantity in the order", async () => {

    // Create a customer
    const customer = new Customer("123", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);

    const customerRepository = new CustomerRepository();
    await customerRepository.create(customer);

    // Create a product
    const product = new Product("123", "Product 1", 10);

    const productRepository = new ProductRepository();
    await productRepository.create(product);

    // Create a order
    const ordemItem = new OrderItem(
      "123",
      product.name,
      product.price,
      product.id,
      2
    );
    const order = new Order("123", "123", [ordemItem]);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    // Update the order
    order.changeProductQuantity("123", 5);
    await orderRepository.update(order);

    // Get the order from database
    const orderModelUpdated = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"]
    });

    //Check the order
    expect(orderModelUpdated.toJSON()).toStrictEqual({
      id: "123",
      customer_id: "123",
      total: order.total,
      items: [
        {
          id: "123",
          name: "Product 1",
          price: 10,
          quantity: 5,
          order_id: "123",
          product_id: "123"
        }
      ]
    });
  });

  it("should add a new item in the order", async () => {

    // Create a customer
    const customer = new Customer("123", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);

    const customerRepository = new CustomerRepository();
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();

    // Create a product 'Product 1'
    const product123 = new Product("123", "Product 1", 10);
    await productRepository.create(product123);

    // Create a product 'Product 2'
    const product456 = new Product("456", "Product 2", 25);
    await productRepository.create(product456);

    // Create a order
    const ordemItem123 = new OrderItem(
      "123",
      product123.name,
      product123.price,
      product123.id,
      2
    );
    const order123 = new Order("123", "123", [ordemItem123]);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order123);

    // Create a new order
    const ordemItem456 = new OrderItem(
      "456",
      product456.name,
      product456.price,
      product456.id,
      3
    );

    // Update the order
    order123.changeItems([ordemItem123, ordemItem456]);
    await orderRepository.update(order123);

    // Get the order from database
    const orderModelUpdated = await OrderModel.findOne({
      where: { id: order123.id },
      include: ["items"]
    });

    //Check the order
    expect(orderModelUpdated.toJSON()).toStrictEqual({
      id: "123",
      customer_id: "123",
      total: order123.total,
      items: [
        {
          id: "123",
          name: "Product 1",
          price: 10,
          quantity: 2,
          order_id: "123",
          product_id: "123"
        },
        {
          id: "456",
          name: "Product 2",
          price: 25,
          quantity: 3,
          order_id: "123",
          product_id: "456"
        }
      ]
    });
  });

  it("should find a order", async () => {

    // Create a customer
    const customer = new Customer("123", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);

    const customerRepository = new CustomerRepository();
    await customerRepository.create(customer);

    // Create a product
    const product = new Product("123", "Product 1", 10);

    const productRepository = new ProductRepository();
    await productRepository.create(product);

    // Create a order
    const ordemItem = new OrderItem(
      "123",
      product.name,
      product.price,
      product.id,
      2
    );
    const order = new Order("123", "123", [ordemItem]);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    // Get the order from database
    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"]
    });

    const fromDatabaseOrder = await orderRepository.find("123");

    //Check the order
    expect(orderModel.toJSON()).toStrictEqual({
      id: fromDatabaseOrder.id,
      customer_id: fromDatabaseOrder.customerId,
      total: fromDatabaseOrder.total,
      items: [
        {
          order_id: fromDatabaseOrder.id,
          id: fromDatabaseOrder.items[0].id,
          product_id: fromDatabaseOrder.items[0].productId,
          name: fromDatabaseOrder.items[0].name,
          price: fromDatabaseOrder.items[0].price,
          quantity: fromDatabaseOrder.items[0].quantity
        }
      ]
    });
  });

  it("should find all orders", async () => {

    // Create a customer
    const customer = new Customer("123", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);

    const customerRepository = new CustomerRepository();
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();

    // Create a product 'Product 1'
    const product123 = new Product("123", "Product 1", 10);
    await productRepository.create(product123);

    // Create a product 'Product 2'
    const product456 = new Product("456", "Product 2", 25);
    await productRepository.create(product456);

    const orderRepository = new OrderRepository();

    // Create a order 123
    const ordemItem123 = new OrderItem(
      "123",
      product123.name,
      product123.price,
      product123.id,
      2
    );
    const order123 = new Order("123", "123", [ordemItem123]);
    await orderRepository.create(order123);

    // Create a order 456
    const ordemItem456 = new OrderItem(
      "456",
      product456.name,
      product456.price,
      product456.id,
      2
    );
    const order456 = new Order("456", "123", [ordemItem456]);
    await orderRepository.create(order456);

    // Get the order from database
    const fromDatabaseOrders = await orderRepository.findAll();

    expect(fromDatabaseOrders.length).toBeGreaterThan(1);
  });

});