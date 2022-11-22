import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import OrderRepositoryInterface from "../../../../domain/checkout/repository/order-repository.interface";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";


export default class OrderRepository implements OrderRepositoryInterface {

  async create(entity: Order): Promise<void> {
    await OrderModel.create(
      {
        id: entity.id,
        customer_id: entity.customerId,
        total: entity.total,
        items: entity.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity
        })),
      },
      {
        include: [{ model: OrderItemModel }]
      }
    );
  }

  async update(entity: Order): Promise<void> {

    //It gets the order to be updated
    const orderModel = await OrderModel.findOne({
      where: { id: entity.id },
      include: ["items"]
    });

    //It destroys all items
    const destroyOrderItemsPromise = orderModel.items.map((item) =>
      OrderItemModel.destroy({
        where: {
          id: item.id
        }
      })
    );
    await Promise.all(destroyOrderItemsPromise);

    //It creates new items
    const addOrderItemsPromise = entity.items.map(item => {
      const { id, name, price, productId, quantity } = item;
      return OrderItemModel.create({
        id,
        name,
        price,
        product_id: productId,
        quantity,
        order_id: entity.id
      });
    })
    await Promise.all(addOrderItemsPromise);

    //It update the order
    await OrderModel.update(
      {
        customer_id: entity.customerId,
        total: entity.total,
      },
      {
        where: {
          id: entity.id
        }
      }
    );
  }

  async find(id: string): Promise<Order> {

    const orderModel = await OrderModel.findOne({
      where: { id },
      include: ["items"]
    });

    return this.retrieveOrder(orderModel);
  }

  async findAll(): Promise<Order[]> {
    const orderModels = await OrderModel.findAll({
      include: ["items"]
    });

    return orderModels.map((orderModel) => {
        return this.retrieveOrder(orderModel);
      }
    );
  }

  retrieveOrder(orderModel: OrderModel): Order {
    const orderItemModel = orderModel.items.map(item =>
      new OrderItem(item.id, item.name, item.price, item.product_id, item.quantity)
    );
    return new Order(orderModel.id, orderModel.customer_id, orderItemModel);
  }
}
