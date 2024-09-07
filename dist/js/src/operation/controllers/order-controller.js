"use strict";
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
exports.OrderController = void 0;
const order_use_case_1 = require("../../core/usercases/order-use-case");
const order_1 = require("../gateways/order");
const order_2 = require("../presenters/order");
class OrderController {
    constructor(orderDataSource) {
        const orderGateway = new order_1.OrderGateway(orderDataSource);
        order_use_case_1.OrderUseCase.listenForNewOrder(orderGateway);
    }
    static receiveOrder(newOrder, orderDataSource) {
        return __awaiter(this, void 0, void 0, function* () {
            const orderGateway = new order_1.OrderGateway(orderDataSource);
            if (!orderGateway) {
                throw new Error("Gateway Inválido");
            }
            const order = yield order_use_case_1.OrderUseCase.receiveOrder(newOrder, orderGateway);
            if (order) {
                return order_2.OrderPresenter.toDTO(order);
            }
            return null;
        });
    }
    static prepareOrder(id, orderDataSource) {
        return __awaiter(this, void 0, void 0, function* () {
            const orderGateway = new order_1.OrderGateway(orderDataSource);
            if (!orderGateway) {
                throw new Error("Gateway Inválido");
            }
            const order = yield order_use_case_1.OrderUseCase.prepareOrder(id, orderGateway);
            if (order) {
                return order_2.OrderPresenter.toDTO(order);
            }
            return null;
        });
    }
    static estimateDelivery(id, orderDataSource) {
        return __awaiter(this, void 0, void 0, function* () {
            const orderGateway = new order_1.OrderGateway(orderDataSource);
            if (!orderGateway) {
                throw new Error("Gateway Inválido");
            }
            const order = yield order_use_case_1.OrderUseCase.estimateDelivery(id, orderGateway);
            if (order) {
                return order;
            }
            return null;
        });
    }
    static updateStatusToReady(id, orderDataSource) {
        return __awaiter(this, void 0, void 0, function* () {
            const orderGateway = new order_1.OrderGateway(orderDataSource);
            if (!orderGateway) {
                throw new Error("Gateway Inválido");
            }
            const order = yield order_use_case_1.OrderUseCase.updateStatusToReady(id, orderGateway);
            if (order) {
                return order;
            }
            return null;
        });
    }
    static updateStatusToDelivered(id, orderDataSource) {
        return __awaiter(this, void 0, void 0, function* () {
            const orderGateway = new order_1.OrderGateway(orderDataSource);
            if (!orderGateway) {
                throw new Error("Gateway Inválido");
            }
            const order = yield order_use_case_1.OrderUseCase.updateStatusToDelivered(id, orderGateway);
            if (order) {
                return order;
            }
            return null;
        });
    }
    static updateStatusToClosed(id, orderDataSource) {
        return __awaiter(this, void 0, void 0, function* () {
            const orderGateway = new order_1.OrderGateway(orderDataSource);
            if (!orderGateway) {
                throw new Error("Gateway Inválido");
            }
            const order = yield order_use_case_1.OrderUseCase.updateStatusToClosed(id, orderGateway);
            if (order) {
                return order;
            }
            return null;
        });
    }
    static getAllActiveOrders(orderDataSource) {
        return __awaiter(this, void 0, void 0, function* () {
            const orderGateway = new order_1.OrderGateway(orderDataSource);
            if (!orderGateway) {
                throw new Error("Gateway Inválido");
            }
            const order = yield order_use_case_1.OrderUseCase.getAllActiveOrders(orderGateway);
            if (order) {
                return order;
            }
            return null;
        });
    }
}
exports.OrderController = OrderController;
