import { OrderGateway } from '../../operation/gateways/order';
import { OrderEntity } from "../entities/order";
import { generateRandomString } from "../../common/helpers/generators";
import { NewOrderDTO } from "../../common/dtos/order.dto";
import { RabbitMQ } from '../../external/mq/mq';

export class OrderUseCase {
    private static mq: RabbitMQ;

    constructor(mq: RabbitMQ) {
        OrderUseCase.mq = mq;
    }

    static async receiveOrder(newOrder: NewOrderDTO, orderGateway: OrderGateway): Promise<OrderEntity | null> {
        const status = "RECEIVED";

        let estimatedDelivery: number = newOrder.cart.estimatedTime;
        const ordersReceived = (await OrderUseCase.getAllActiveOrders(orderGateway));
        if (ordersReceived != null) {
            if (ordersReceived.length > 0) {
                let idsOrders = [] as number[];
                const ordersQueue = ordersReceived!.filter(value =>
                    (value.status == "RECEIVED" || value.status == "PREPARING")
                    && Date.now().valueOf() >= value.receiveDate.valueOf());

                let lastIItem = ordersQueue.reduce((latest, current) => {
                    return current.receiveDate > latest.receiveDate ? current : latest;
                }, ordersQueue[0]);

                const order = ordersReceived!.filter(o => o.id === lastIItem.id);
                estimatedDelivery += order[0].deliveryTime;
            }
        }

        const novoId = generateRandomString();

        const order = new OrderEntity(
            novoId,
            new Date(),
            estimatedDelivery,
            status,
            newOrder.cart
        );
        const nOrder = await orderGateway.create(order);
        if (nOrder) {
            return nOrder;
        }
        else {
            return null;
        }
    }

    static async prepareOrder(idOrder: string, orderGateway: OrderGateway): Promise<OrderEntity | null> {
        const order = await orderGateway.findOne(idOrder);
        if (order) {
            order.status = "PREPARING";
            return orderGateway.update(idOrder, order);
        }
        else {
            return null
        }
    }

    static async estimateDelivery(idOrder: string, orderGateway: OrderGateway): Promise<string> {
        const order = await orderGateway.findOne(idOrder);
        if (order) {
            let estimatedDelivery = new Date((order.receiveDate.getTime() + order.deliveryTime * 60000));
            return `The estimate time to order is ready is ${estimatedDelivery}`;
        }
        else {
            return "Order não encontrada";
        }
    }

    static async sendNotificationDelivery(idOrder: string, orderGateway: OrderGateway): Promise<string> {
        const order = await orderGateway.findOne(idOrder);
        if (order) {
            return `The order is ready to delivery`;
        }
        else {
            return "Order não encontrada";
        }
    }

    static async updateStatusToReady(idOrder: string, orderGateway: OrderGateway): Promise<string> {
        const order = await orderGateway.findOne(idOrder);
        if (order) {
            order.status = "READY";
            await orderGateway.update(idOrder, order);
            return OrderUseCase.sendNotificationDelivery(idOrder, orderGateway);
        }
        else {
            return "Order não encontrada";
        }
    }

    static async updateStatusToDelivered(idOrder: string, orderGateway: OrderGateway): Promise<OrderEntity | null> {
        const order = await orderGateway.findOne(idOrder);
        if (order) {
            order.status = "DELIVERED";
            return orderGateway.update(idOrder, order);
        }
        else {
            return null;
        }
    }

    static async updateStatusToClosed(idOrder: string, orderGateway: OrderGateway): Promise<OrderEntity | null> {
        const order = await orderGateway.findOne(idOrder);
        if (order) {
            order.status = "CLOSED";
            return orderGateway.update(idOrder, order);
        }
        else {
            return null;
        }
    }
    static async getAllActiveOrders(orderGateway: OrderGateway): Promise<OrderEntity[] | null> {
        const result = await orderGateway.getAll();
        if (result) {
            return result.filter((p) => p.status !== "CLOSED" && p.status !== "DELIVERED")
        }
        else {
            return null;
        }

    }

    static async listenForNewOrder(orderGateway: OrderGateway): Promise<void> {
        OrderUseCase.mq = new RabbitMQ();
        await OrderUseCase.mq.connect();
        await OrderUseCase.mq.consume('new_order', async (message: any) => {
            const newOrder: NewOrderDTO = message;
            OrderUseCase.receiveOrder(newOrder, orderGateway);
        });
    }
}