import { Appointment } from '../entities/appointment';
import { ConflictError } from '../../common/errors/conflict-error';
import { EmailNotificationService } from '../../external/notification/notification-service';
import { NotFoundError } from '../../common/errors/not-found-error';
import { RabbitMQ } from '../../external/mq/mq';
import { Doctor } from '../entities/doctor';
import { Paciente } from '../entities/paciente';
import { Gateway } from '../../operation/gateway/gateway';


export class ScheduleAppointmentUseCase {
  constructor(private gateway: Gateway, private emailNotificationService: EmailNotificationService, private mq: RabbitMQ
  ) {
    console.log("Listernes");
    this.listeners();
  }

  async reserveAppointment(paciente: Paciente, idAppointment: string) {

    const appointment = await this.gateway.findAll();
    const app = appointment.filter(a => (a._id).toString() === idAppointment);
    if (!app) {
      throw new NotFoundError("Appointment not founded");
    }
    console.log(app[0].status);
    if (app[0].status == true) {
      throw new ConflictError('Horário já está ocupado.');
    }

    app[0].patientId = paciente._id;
    app[0].status = true;
    console.log('edita');
    await this.gateway.edit(app[0]);
    console.log('editado');
    let doctor;
    try {
      this.mq = new RabbitMQ();
      await this.mq.connect();
      console.log("Publicado getDoctor");
      doctor = await this.mq.publishExclusive('getDoctor', { id: app[0].doctorId }) as unknown as Doctor;
      await this.mq.close();
    }
    catch (ConflictError) {
      throw new Error("Erro ao publicar mensagem");
    }
    this.emailNotificationService.notifyDoctor(doctor.email, doctor.name, paciente.name, app[0].date);
  }

  async newAppointment(appointments: Appointment[]) {
    this.mq = new RabbitMQ();
    await this.mq.connect();

    for (const appointment of appointments) {
      appointment.date = parseDate((appointment.date).toString());

      const listAppointments = await this.findAppointmentsByDoctor(appointment.doctorId);

      const conflictItem = listAppointments.filter(a => appointment.date >= a.date && appointment.date <= new Date(a.date.getTime() + 1800000));

      if (conflictItem.length > 0) {
        return false;
      }
      await this.gateway.save(appointment);
    }
    return true;
  }


  async editAppointment(id: string, appointment: Appointment) {
    try {
      const olderAppointment = await this.gateway.findById(id);
      console.log(olderAppointment.date);
      if (!olderAppointment) {
        throw new NotFoundError("Appointment not founded");
      }
      await this.gateway.edit(appointment);
    }
    catch (Erro) {
      console.log('Erro ao editar appointment')
    }
  }

  async findAppointmentsByDoctor(doctorId: string) {
    const lista = await this.gateway.findAll();
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
      this.mq = new RabbitMQ();
      await this.mq.connect();
      const appointments: Appointment[] = message.message.appointments;
      console.log("Fila newAppointments. Lenght: " + appointments.length);
      const resposta = await this.newAppointment(appointments);
      console.log(resposta);
      await this.mq.publishReply(message.replyTo, resposta, message.correlationId);

    });
    await this.mq.consume('editAppointment', async (message: any) => {
      this.mq = new RabbitMQ();
      await this.mq.connect();
      const appointment: Appointment = message.appointment;
      const id: string = message.id;
      console.log("Fila editAppointment. ID: " + appointment._id);
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

function parseDate(dateString: string): Date {
  const [datePart, timePart] = dateString.split(' ');
  const [day, month, year] = datePart.split('/').map(Number);
  const [hours, minutes] = timePart.split(':').map(Number);

  // O mês é 0-indexado (Janeiro é 0)
  return new Date(year, month - 1, day, hours, minutes);
}