import { ScheduleController } from '../../src/operation/controllers/schedule-controller';
import { ScheduleAppointmentUseCase } from '../../src/core/usercases/appointment-use-case';
import { Request, Response } from 'express';
import { Paciente } from '../../src/core/entities/paciente';
import { AppointmentRepositoryImpl } from '../../src/external/data-sources/mongodb/appointments-repository-mongo';
import { EmailNotificationService } from '../../src/external/notification/notification-service';
import { Gateway } from '../../src/operation/gateway/gateway';
import { RabbitMQ } from '../../src/external/mq/mq';
import { Controller } from 'tsoa';


jest.mock('../../src/operation/gateway/gateway');
jest.mock('../../src/external/notification/notification-service');
jest.mock('../../src/external/mq/mq');
jest.mock('../../src/external/data-sources/mongodb/appointments-repository-mongo');
jest.mock('../../src/core/usercases/appointment-use-case');

describe('ScheduleController', () => {
    let repository: jest.Mocked<AppointmentRepositoryImpl>;
    let useCase: ScheduleAppointmentUseCase;
    let gateway: jest.Mocked<Gateway>;
    let emailNotificationService: jest.Mocked<EmailNotificationService>;
    let mq: jest.Mocked<RabbitMQ>;
    let req: Partial<Request>;
    let res: Partial<Response>;
    let controller: ScheduleController;

    beforeEach(() => {
        repository = new AppointmentRepositoryImpl as jest.Mocked<AppointmentRepositoryImpl>;
        gateway = new Gateway(repository) as jest.Mocked<Gateway>;
        emailNotificationService = new EmailNotificationService() as jest.Mocked<EmailNotificationService>;
        mq = new RabbitMQ() as jest.Mocked<RabbitMQ>;
    
        useCase = new ScheduleAppointmentUseCase(gateway, emailNotificationService, mq)as jest.Mocked<ScheduleAppointmentUseCase>;
        controller = new ScheduleController(useCase);

        req = {
            body: {}
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    describe('reserve', () => {
        it('should reserve an appointment and return a success message', async () => {
            req.body = {
                paciente: new Paciente('1', 'Test Paciente', '12345678900', 'test@example.com', 'hashed_password'),
                idAppointment: 'appointmentId'
            };
            await controller.reserve(req as Request, res as Response);

            expect(useCase.reserveAppointment).toHaveBeenCalledWith(req.body.paciente, req.body.idAppointment);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith('Horários criados com sucesso');
        });

    });
});
