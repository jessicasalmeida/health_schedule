"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderRouter = void 0;
const express_1 = __importStar(require("express"));
const order_repository_mongo_bd_1 = require("../../data-sources/mongodb/order-repository-mongo-bd");
const order_controller_1 = require("../../../operation/controllers/order-controller");
const orderRepository = new order_repository_mongo_bd_1.OrderRepositoryMongoBd();
const orderController = new order_controller_1.OrderController(orderRepository);
exports.orderRouter = (0, express_1.Router)();
exports.orderRouter.use(express_1.default.json());
exports.orderRouter.post('/receive/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    /*  #swagger.tags = ['Order']
        #swagger.summary = 'Receive'
        #swagger.description = 'Endpoint to receive a order' */
    const newOrder = req.body;
    const order = yield order_controller_1.OrderController.receiveOrder(newOrder, orderRepository);
    res.status(200).json(order);
}));
exports.orderRouter.post('/prepare/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    /*  #swagger.tags = ['Order']
    #swagger.summary = 'Prepare'
    #swagger.description = 'Endpoint to update status to prepare a order' */
    const id = req.params.id;
    const order = yield order_controller_1.OrderController.prepareOrder(id, orderRepository);
    res.status(200).json(order);
}));
exports.orderRouter.get('/estimate/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    /*  #swagger.tags = ['Order']
    #swagger.summary = 'Estimatte'
    #swagger.description = 'Endpoint to calcute estimate of time from a order' */
    const id = req.params.id;
    const order = yield order_controller_1.OrderController.estimateDelivery(id, orderRepository);
    res.status(200).json(order);
}));
exports.orderRouter.post('/update/ready/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    /*  #swagger.tags = ['Order']
    #swagger.summary = 'Ready'
    #swagger.description = 'Endpoint to update status to ready' */
    const id = req.params.id;
    const order = yield order_controller_1.OrderController.updateStatusToReady(id, orderRepository);
    res.status(200).json(order);
}));
exports.orderRouter.post('/update/delivered/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    /*  #swagger.tags = ['Order']
    #swagger.summary = 'Delivery'
    #swagger.description = 'Endpoint to update status to delivered' */
    const id = req.params.id;
    const order = yield order_controller_1.OrderController.updateStatusToDelivered(id, orderRepository);
    res.status(200).json(order);
}));
exports.orderRouter.post('/update/closed/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    /*  #swagger.tags = ['Order']
    #swagger.summary = 'Close'
    #swagger.description = 'Endpoint to update status to closed' */
    const id = req.params.id;
    const order = yield order_controller_1.OrderController.updateStatusToClosed(id, orderRepository);
    res.status(200).json(order);
}));
exports.orderRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    /*  #swagger.tags = ['Order']
    #swagger.summary = 'GetAll Active'
    #swagger.description = 'Endpoint to get all active orders' */
    const order = yield order_controller_1.OrderController.getAllActiveOrders(orderRepository);
    res.status(200).json(order);
}));
