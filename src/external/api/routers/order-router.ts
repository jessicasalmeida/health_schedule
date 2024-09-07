import express, { Router } from "express";
import { OrderRepositoryMongoBd } from "../../data-sources/mongodb/order-repository-mongo-bd";
import { OrderController } from '../../../operation/controllers/order-controller';

const orderRepository = new OrderRepositoryMongoBd();
const orderController = new OrderController(orderRepository);

export const orderRouter = Router();

orderRouter.use(express.json());

orderRouter.post('/receive/', async (req, res) => {
    /*  #swagger.tags = ['Order']
        #swagger.summary = 'Receive'
        #swagger.description = 'Endpoint to receive a order' */
    const newOrder = req.body;
    const order = await OrderController.receiveOrder(newOrder, orderRepository);
    res.status(200).json(order);
});

orderRouter.post('/prepare/:id', async (req, res) => {
    /*  #swagger.tags = ['Order']
    #swagger.summary = 'Prepare'
    #swagger.description = 'Endpoint to update status to prepare a order' */
    const id = req.params.id;
    const order = await OrderController.prepareOrder(id, orderRepository);
    res.status(200).json(order);
});

orderRouter.get('/estimate/:id', async (req, res) => {
    /*  #swagger.tags = ['Order']
    #swagger.summary = 'Estimatte'
    #swagger.description = 'Endpoint to calcute estimate of time from a order' */
    const id = req.params.id;
    const order = await OrderController.estimateDelivery(id, orderRepository);
    res.status(200).json(order);
});

orderRouter.post('/update/ready/:id', async (req, res) => {
    /*  #swagger.tags = ['Order']
    #swagger.summary = 'Ready'
    #swagger.description = 'Endpoint to update status to ready' */
    const id = req.params.id;
    const order = await OrderController.updateStatusToReady(id, orderRepository);
    res.status(200).json(order);
});

orderRouter.post('/update/delivered/:id', async (req, res) => {
    /*  #swagger.tags = ['Order']
    #swagger.summary = 'Delivery'
    #swagger.description = 'Endpoint to update status to delivered' */
    const id = req.params.id;
    const order = await OrderController.updateStatusToDelivered(id, orderRepository);
    res.status(200).json(order);
});

orderRouter.post('/update/closed/:id', async (req, res) => {
    /*  #swagger.tags = ['Order']
    #swagger.summary = 'Close'
    #swagger.description = 'Endpoint to update status to closed' */
    const id = req.params.id;
    const order = await OrderController.updateStatusToClosed(id, orderRepository);
    res.status(200).json(order);
});

orderRouter.get('/', async (req, res) => {
    /*  #swagger.tags = ['Order']
    #swagger.summary = 'GetAll Active'
    #swagger.description = 'Endpoint to get all active orders' */
    const order = await OrderController.getAllActiveOrders(orderRepository);
    res.status(200).json(order);
}); 