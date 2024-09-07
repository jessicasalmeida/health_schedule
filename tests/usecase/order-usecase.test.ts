import { CartItensDTO, ItensDTO, NewOrderDTO, ProductDTO } from "../../src/common/dtos/order.dto";
import { generateRandomString } from "../../src/common/helpers/generators";
import { OrderEntity } from "../../src/core/entities/order";
import { OrderUseCase } from "../../src/core/usercases/order-use-case";
import { OrderGateway } from "../../src/operation/gateways/order";

// Mock OrderGateway
const mockOrderGateway = {} as OrderGateway;

describe('OrderUseCase', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should receive order', async () => {
        const date = new Date();
        const mockProductDTO: ProductDTO = {id: "0", name: "",  options: "", price:0, timeToPrepare:15, category: "", status: true};
        const mockItensDTO: ItensDTO[] = [{id: 0, options: "", price: 0, product: mockProductDTO}];
        const mockCartItens: CartItensDTO = {id : "0", user: "", totalValue: 0, status: "New", payment:true, estimatedTime: 15, cartItens: mockItensDTO};
        const mockNewOrder: NewOrderDTO = { receiveDate: date, deliveryTime:15, status: "New", cart: mockCartItens};
       
        const mockOrderEntity = new OrderEntity('mockId', new Date(), 30, 'RECEIVED', mockNewOrder.cart);

        // Mocking getAllActiveOrders
        jest.spyOn(OrderUseCase, 'getAllActiveOrders').mockResolvedValueOnce([mockOrderEntity]);

        // Mocking create method of OrderGateway
        mockOrderGateway.create = jest.fn().mockResolvedValueOnce(mockOrderEntity);

        const result = await OrderUseCase.receiveOrder(mockNewOrder, mockOrderGateway);

        expect(result).toEqual(mockOrderEntity);
    });

    it('should prepare order', async () => {
        const mockOrderId = 'mockId';
        const mockOrderEntity = new OrderEntity(mockOrderId, new Date(), 30, 'RECEIVED', {});

        // Mocking findOne and update methods of OrderGateway
        mockOrderGateway.findOne = jest.fn().mockResolvedValueOnce(mockOrderEntity);
        mockOrderGateway.update = jest.fn().mockResolvedValueOnce(mockOrderEntity);

        const result = await OrderUseCase.prepareOrder(mockOrderId, mockOrderGateway);

        expect(result).toEqual(mockOrderEntity);
        expect(mockOrderGateway.update).toHaveBeenCalledWith(mockOrderId, expect.objectContaining({
            status: 'PREPARING'
        }));
    });

    it('should estimate delivery', async () => {
        const mockOrderId = 'mockId';
        const mockOrderEntity = new OrderEntity(mockOrderId, new Date(), 30, 'RECEIVED', {});

        // Mocking findOne method of OrderGateway
        mockOrderGateway.findOne = jest.fn().mockResolvedValueOnce(mockOrderEntity);

        const result = await OrderUseCase.estimateDelivery(mockOrderId, mockOrderGateway);

        expect(result).toContain('The estimate time to order is ready');
    });

    it('should update status to ready', async () => {
        const mockOrderId = 'mockId';
        const mockOrderEntity = new OrderEntity(mockOrderId, new Date(), 30, 'RECEIVED', {});

        // Mocking findOne and update methods of OrderGateway
        mockOrderGateway.findOne = jest.fn().mockResolvedValueOnce(mockOrderEntity);
        mockOrderGateway.update = jest.fn().mockResolvedValueOnce(mockOrderEntity);

        const result = await OrderUseCase.updateStatusToReady(mockOrderId, mockOrderGateway);

        expect(result).toContain('Order não encontrada');
        expect(mockOrderGateway.update).toHaveBeenCalledWith(mockOrderId, expect.objectContaining({
            status: 'READY'
        }));
    });

    it('should update status to ready', async () => {
        const mockOrderId = '0';
        const mockOrderEntity = new OrderEntity(mockOrderId, new Date(), 30, 'RECEIVED', {});

        // Mocking findOne and update methods of OrderGateway
        mockOrderGateway.findOne = jest.fn().mockResolvedValueOnce(mockOrderEntity);
        mockOrderGateway.update = jest.fn().mockResolvedValueOnce(mockOrderEntity);

        const result = await OrderUseCase.updateStatusToReady(mockOrderId, mockOrderGateway);
        expect(mockOrderGateway.update).toHaveBeenCalledWith(mockOrderId, expect.objectContaining({
            status: 'READY'
        }));
    });

    it('should update status to delivered', async () => {
        const mockOrderId = 'mockId';
        const mockOrderEntity = new OrderEntity(mockOrderId, new Date(), 30, 'RECEIVED', {});

        // Mocking findOne and update methods of OrderGateway
        mockOrderGateway.findOne = jest.fn().mockResolvedValueOnce(mockOrderEntity);
        mockOrderGateway.update = jest.fn().mockResolvedValueOnce(mockOrderEntity);

        const result = await OrderUseCase.updateStatusToDelivered(mockOrderId, mockOrderGateway);

        expect(result).toEqual(mockOrderEntity);
        expect(mockOrderGateway.update).toHaveBeenCalledWith(mockOrderId, expect.objectContaining({
            status: 'DELIVERED'
        }));
    });

    it('should update status to closed', async () => {
        const mockOrderId = 'mockId';
        const mockOrderEntity = new OrderEntity(mockOrderId, new Date(), 30, 'RECEIVED', {});

        // Mocking findOne and update methods of OrderGateway
        mockOrderGateway.findOne = jest.fn().mockResolvedValueOnce(mockOrderEntity);
        mockOrderGateway.update = jest.fn().mockResolvedValueOnce(mockOrderEntity);

        const result = await OrderUseCase.updateStatusToClosed(mockOrderId, mockOrderGateway);

        expect(result).toEqual(mockOrderEntity);
        expect(mockOrderGateway.update).toHaveBeenCalledWith(mockOrderId, expect.objectContaining({
            status: 'CLOSED'
        }));
    });

    it('should get all active orders', async () => {
        const mockOrderEntity = new OrderEntity('mockId', new Date(), 30, 'RECEIVED', {});

        // Mocking getAll method of OrderGateway
        mockOrderGateway.getAll = jest.fn().mockResolvedValueOnce([mockOrderEntity]);

        const result = await OrderUseCase.getAllActiveOrders(mockOrderGateway);

        expect(result).toEqual([mockOrderEntity]);
    });
});
