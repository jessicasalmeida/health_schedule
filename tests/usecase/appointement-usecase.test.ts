
import { Appointment } from '../../src/core/entities/appointment';
import { ConflictError } from '../../src/common/errors/conflict-error';
import { EmailNotificationService } from '../../src/external/notification/notification-service';
import { NotFoundError } from '../../src/common/errors/not-found-error';
import { RabbitMQ } from '../../src/external/mq/mq';
import { Paciente } from '../../src/core/entities/paciente';
import { Doctor } from '../../src/core/entities/doctor';
import { Gateway } from '../../src/operation/gateway/gateway';
import { ScheduleAppointmentUseCase } from '../../src/core/usercases/appointment-use-case';
import { AppointmentRepositoryImpl } from '../../src/external/data-sources/mongodb/appointments-repository-mongo';

jest.mock('../../src/operation/gateway/gateway');
jest.mock('../../src/external/notification/notification-service');
jest.mock('../../src/external/mq/mq');
jest.mock('../../src/external/data-sources/mongodb/appointments-repository-mongo');

describe('ScheduleAppointmentUseCase', () => {
  let repository: jest.Mocked<AppointmentRepositoryImpl>;
  let useCase: ScheduleAppointmentUseCase;
  let gateway: jest.Mocked<Gateway>;
  let emailNotificationService: jest.Mocked<EmailNotificationService>;
  let mq: jest.Mocked<RabbitMQ>;

  beforeEach(() => {
    repository = new AppointmentRepositoryImpl as jest.Mocked<AppointmentRepositoryImpl>;
    gateway = new Gateway(repository) as jest.Mocked<Gateway>;
    emailNotificationService = new EmailNotificationService() as jest.Mocked<EmailNotificationService>;
    mq = new RabbitMQ() as jest.Mocked<RabbitMQ>;

    useCase = new ScheduleAppointmentUseCase(gateway, emailNotificationService, mq);
  });

  describe('newAppointment', () => {
    it('should return false if there is a conflict in the appointment time', async () => {
      const mockAppointments = [
        new Appointment('2', 'doctorId', '', new Date(new Date().getTime()), true)
      ];
      gateway.findAll.mockResolvedValue(mockAppointments);

      const newAppointments = [
        new Appointment('2', 'doctorId', '', new Date(new Date().getTime()), true)
      ];

      const result = await useCase.newAppointment(newAppointments);

      expect(result).toBe(true);
    });

    it('should save new appointments if no conflict exists', async () => {
      gateway.findAll.mockResolvedValue([]);

      const newAppointments = [
        new Appointment('2', 'doctorId', '', new Date(new Date().getTime() + 1000), true)
      ];

      const result = await useCase.newAppointment(newAppointments);

      expect(gateway.save).toHaveBeenCalledWith(newAppointments[0]);
      expect(result).toBe(true);
    });
  });

  describe('editAppointment', () => {
    it('should throw NotFoundError if appointment does not exist', async () => {
      gateway.findById.mockRejectedValue(new NotFoundError(''));

      await expect(useCase.editAppointment('1', new Appointment('2', 'doctorId', '', new Date(new Date().getTime() + 1000), true))).rejects.toThrow(NotFoundError);
    });

    it('should edit an existing appointment', async () => {
      const mockAppointment = new Appointment('2', 'doctorId', '', new Date(new Date().getTime() + 1000), true);
      gateway.findById.mockResolvedValue(mockAppointment);

      await useCase.editAppointment('1', mockAppointment);

      expect(gateway.edit).toHaveBeenCalledWith(mockAppointment);
    });
  });

  describe('findAppointmentsByDoctor', () => {
    it('should return a list of appointments for a given doctor', async () => {
      const mockAppointments = [
        new Appointment('2', 'doctorId', '', new Date(new Date().getTime() + 1000), true),
        new Appointment('2', 'doctorId', '', new Date(new Date().getTime() + 1000), true)
      ];
      gateway.findAll.mockResolvedValue(mockAppointments);

      const result = await useCase.findAppointmentsByDoctor('doctorId');

      expect(result.length).toBe(2);
      expect(result[0].doctorId).toBe('doctorId');
    });
  });

  
});
