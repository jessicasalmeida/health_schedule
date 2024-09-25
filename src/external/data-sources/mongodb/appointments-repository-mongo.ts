import { AppointmentRepository } from "../../../common/interfaces/appointment-data-source";
import { Appointment } from '../../../core/entities/appointment';
import { collections } from './db-connect';

export class AppointmentRepositoryImpl implements AppointmentRepository {

  async save(appointment: Appointment): Promise<Appointment> {
    const savedAppointment = await collections.appointment?.insertOne(appointment);
    return savedAppointment as unknown as Appointment;
  }


  async findById(id: string): Promise<Appointment> {
    const query = { id: id };
    const savedAppointment = await collections.appointment?.findOne(query);
    return savedAppointment as unknown as Appointment;
  }

  async edit(appointment: Appointment): Promise<Appointment> {
    const query = { id: (appointment.id) };
    const savedAppointment = await collections.appointment?.updateOne(query, { $set: appointment });
    return savedAppointment as unknown as Appointment;
  }

  async findAppointmentsByDate(doctorId: string, date: Date): Promise<boolean> {
    const start = date;
    const end = new Date(date);
    console.log(start);
    end.setMinutes(end.getMinutes() + 30); // Define o final do intervalo como 30 minutos após o início
    console.log(end);
    // Verifica se há algum agendamento que se sobrepõe ao intervalo desejado
    const conflict = await collections.appointment?.findOne({
      doctorId: doctorId,
      date: {
        $lt: end,   // Horários com início antes do final desejado
        $gte: start // Horários com início no mesmo intervalo ou posterior
      }
    });
    return !conflict;
  }

  async findAppointmentsByDoctor(doctorId: string): Promise<Appointment[]> {
    const query = { doctorId: (doctorId) };
    const appointments = await collections.appointment?.find(query);
    return appointments as unknown as Appointment[];
  }

  async findAll(): Promise<Appointment[]> {
    return await collections.appointment?.find({}).toArray() as Appointment[]
  }
}
