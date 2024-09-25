import { AppointmentRepository } from '../../src/common/interfaces/appointment-data-source';
import { EmailNotificationService } from '../../src/external/notification/notification-service';
import { RabbitMQ } from '../../src/external/mq/mq';
import { ScheduleAppointmentUseCase } from '../../src/core/usercases/appointment-use-case';
import { AppointmentRepositoryImpl } from '../../src/external/data-sources/mongodb/appointments-repository-mongo';
import { Paciente } from '../../src/core/entities/paciente';
import { NotFoundError } from '../../src/common/errors/not-found-error';
import { Appointment } from '../../src/core/entities/appointment';
import { ConflictError } from '../../src/common/errors/conflict-error';

jest.mock('../../common/interfaces/appointment-data-source');
jest.mock('../../external/notification/notification-service');
jest.mock('../../external/mq/mq');

describe('ScheduleAppointmentUseCase', () => {
  let appointmentRepository: jest.Mocked<AppointmentRepository>;
  let emailNotificationService: jest.Mocked<EmailNotificationService>;
  let mq: jest.Mocked<RabbitMQ>;
  let useCase: ScheduleAppointmentUseCase;

  beforeEach(() => {
    appointmentRepository = new (AppointmentRepositoryImpl as any)();
    emailNotificationService = new (EmailNotificationService as any)();
    mq = new (RabbitMQ as any)();

    useCase = new ScheduleAppointmentUseCase(appointmentRepository, emailNotificationService, mq);
  });

  describe('reserveAppointment', () => {
    it('should throw NotFoundError if appointment is not found', async () => {
      appointmentRepository.findById.mockResolvedValue(null);

      const paciente = new Paciente("001", "jess", "000", "123", "123");
      await expect(useCase.reserveAppointment(paciente, 'non-existing-id')).rejects.toThrow(NotFoundError);
    });

    it('should throw ConflictError if the appointment is already reserved', async () => {
      const existingAppointment = new Paciente("001", "jess", "000", "123", "123")
      existingAppointment.status = true; // already reserved
      appointmentRepository.findById.mockResolvedValue(existingAppointment);

      const paciente = new Paciente("001", "jess", "000", "123", "123");
      await expect(useCase.reserveAppointment(paciente, 'existing-id')).rejects.toThrow(ConflictError);
    });

    it('should reserve the appointment and send a notification', async () => {
      const existingAppointment = new Appointment("","","", new Date(),true);
      existingAppointment.status = false; // available
      appointmentRepository.findById.mockResolvedValue(existingAppointment);
      appointmentRepository.edit.mockResolvedValue(null);
      mq.publishExclusive.mockResolvedValue({ email: 'doctor@mail.com', name: 'Dr. Who' });

      const paciente = new Paciente("001", "jess", "000", "123", "123");
      paciente.name = 'Paciente Test';
      await useCase.reserveAppointment(paciente, 'existing-id');

      expect(appointmentRepository.edit).toHaveBeenCalledWith(expect.objectContaining({
        status: true,
        patientId: paciente._id
      }));
      expect(emailNotificationService.notifyDoctor).toHaveBeenCalledWith(
        'doctor@mail.com',
        'Dr. Who',
        'Paciente Test',
        existingAppointment.date
      );
    });
  });

  describe('newAppointment', () => {
    it('should throw ConflictError if the appointment time is already taken', async () => {
      const appointments = [new Appointment()];
      appointmentRepository.findAppointmentsByDate.mockResolvedValue([new Appointment()]); // conflicting appointment

      await expect(useCase.newAppointment(appointments)).rejects.toThrow(ConflictError);
    });

    it('should save new appointments if there is no conflict', async () => {
      const appointments = [new Appointment()];
      appointmentRepository.findAppointmentsByDate.mockResolvedValue([]); // no conflicts

      await useCase.newAppointment(appointments);

      expect(appointmentRepository.save).toHaveBeenCalledWith(appointments[0]);
    });
  });

  describe('editAppointment', () => {
    it('should throw NotFoundError if the appointment to edit is not found', async () => {
      appointmentRepository.findById.mockResolvedValue(null);

      const appointment = new Paciente("001", "jess", "000", "123", "123")
      await expect(useCase.editAppointment('non-existing-id', appointment)).rejects.toThrow(NotFoundError);
    });

    it('should edit the appointment if found', async () => {
      const existingAppointment = new Paciente("001", "jess", "000", "123", "123")
      appointmentRepository.findById.mockResolvedValue(existingAppointment);

      const updatedAppointment = new Paciente("001", "jess", "000", "123", "123")
      await useCase.editAppointment('existing-id', updatedAppointment);

      expect(appointmentRepository.edit).toHaveBeenCalledWith(updatedAppointment);
    });
  });

  describe('findAppointmentsByDoctor', () => {
    it('should return filtered appointments by doctorId', async () => {
      const appointments = [
        { doctorId: 'doctor-1' } as Appointment,
        { doctorId: 'doctor-2' } as Appointment,
      ];
      appointmentRepository.findAll.mockResolvedValue(appointments);

      const result = await useCase.findAppointmentsByDoctor('doctor-1');

      expect(result).toEqual([appointments[0]]);
    });
  });
});
