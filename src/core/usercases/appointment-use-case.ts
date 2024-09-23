

import { Appointment } from '../entities/appointment';
import { AppointmentRepository } from '../../common/interfaces/appointment-data-source';
import { ConflictError } from '../../common/errors/conflict-error';
import { EmailNotificationService } from '../../external/notification/notification-service';
import { NotFoundError } from '../../common/errors/not-found-error';
import { RabbitMQ } from '../../external/mq/mq';
import { Doctor } from '../entities/doctor';
import { Paciente } from '../entities/paciente';

export class ScheduleAppointmentUseCase {
  constructor(
    private appointmentRepository: AppointmentRepository, private emailNotificationService: EmailNotificationService, private mq: RabbitMQ
  ) {
    console.log("Listernes");
    this.listeners();
  }

  async reserveAppointment(paciente: Paciente, idAppointment: string) {

    const appointment = await this.appointmentRepository.findById(idAppointment);
    if (!appointment) {
      throw new NotFoundError("Appointment not founded");
    }

    const isAvailable = await this.appointmentRepository.isAvailable(appointment.doctorId, appointment.date);

    if (!isAvailable) {
      throw new ConflictError('Horário já está ocupado.');
    }

    appointment.patientId = paciente._id;
    await this.appointmentRepository.edit(appointment);
    let doctor;
    try {
      this.mq = new RabbitMQ();
      await this.mq.connect();
      console.log("Publicado getDoctor");
      doctor = await this.mq.publishExclusive('getDoctor', { id: appointment.doctorId }) as unknown as Doctor;
      await this.mq.close();
    }
    catch (ConflictError) {
      throw new Error("Erro ao publicar mensagem");
    }

   // this.emailNotificationService.notifyDoctor(doctor.email, doctor.name, paciente.name, appointment.date);

  }

  async newAppointment(appointments: Appointment[]) {
    appointments.forEach(async appointment => {
      const isAvailable = await this.appointmentRepository.isAvailable(appointment.doctorId, appointment.date);
      if (!isAvailable) {
        throw new ConflictError('Horário já está ocupado.');
      }
      await this.appointmentRepository.save(appointment);
    });
  }

  async editAppointment(id: string, appointment: Appointment) {
    const olderAppointment = await this.appointmentRepository.findById(id);
    if (!olderAppointment) {
      throw new NotFoundError("Appointment not founded");
    }
    await this.appointmentRepository.edit(appointment);
  }

  async findAppointmentsByDoctor(doctorId: string) {
    const lista = await this.appointmentRepository.findAll();
    const filtered = lista.filter(a => a.doctorId === doctorId);
    return filtered;
  }

  async listeners(): Promise<void> {
    this.mq = new RabbitMQ();
    await this.mq.connect();
    await this.mq.consume('newReserve', async (message: any) => {
      const paciente = message.paciente;
      const idAppointment = message.idAppointment;
      console.log("Fila newReserve: " + idAppointment);
      await this.reserveAppointment(paciente, idAppointment);
    });
    await this.mq.consume('newAppointments', async (message: any) => {
      const appointments: Appointment[] = message.appointments;
      console.log("Fila newAppointments. Lenght: " + appointments.length);
      await this.newAppointment(appointments);
    });
    await this.mq.consume('editAppointment', async (message: any) => {
      const appointment: Appointment = message.appointment;
      const id: string = message.id;
      console.log("Fila editAppointment. ID: " + appointment.id);
      await this.editAppointment(id, appointment);
    });
    await this.mq.consume('listAppointment', async (message: any) => {
      await this.mq.connect();
      const id: string = message.message.id;
      console.log("Fila listAppointment. ID: " + id);
      await this.mq.publishReply(message.replyTo, await this.findAppointmentsByDoctor(id), message.correlationId);
    });
  }
}
