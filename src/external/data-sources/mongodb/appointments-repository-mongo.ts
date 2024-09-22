import { AppointmentRepository } from "../../../common/interfaces/appointment-data-source";
import { Appointment } from '../../../core/entities/appointment';
import { collections } from "./db-connect";

export class AppointmentRepositoryImpl implements AppointmentRepository {

  async save(appointment: Appointment): Promise<Appointment> {
    const savedAppointment = await collections.appointment?.insertOne(appointment);
    return savedAppointment as unknown as Appointment;
  }

  async findById(id: string): Promise<Appointment> {
    const query = { id: (id)};
    const savedAppointment = await collections.appointment?.findOne(query);
    return savedAppointment as unknown as Appointment;
  }

  async edit(appointment: Appointment): Promise<Appointment> {
    const query = { id: (appointment.id)};
    const savedAppointment = await collections.appointment?.updateOne(query,  {$set: appointment});
    return savedAppointment as unknown as Appointment;
  }

  async isAvailable(doctorId: string, date: Date): Promise<boolean> {
    const query = { doctorId: (doctorId), date: (date), status: true };
    const conflictingAppointment = await collections.appointment?.findOne(query);
    if (conflictingAppointment == null) {
      return true;
    }
    else {
      return false;
    }
  }

  async findAppointmentsByDoctor(doctorId: string): Promise<Appointment[]> {
    const query = { doctorId: (doctorId)};
    const appointments = await collections.appointment?.find(query);
    return appointments as unknown as Appointment[];
  }

  async findAll(): Promise<Appointment[]> {
    return await collections.appointment?.find({}).toArray() as Appointment[]
  }
}
