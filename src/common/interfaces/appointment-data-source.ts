import { Appointment } from "../../core/entities/appointment";

export interface AppointmentRepository {
  save(appointment: Appointment): Promise<Appointment>;
  findById(id: string): Promise<Appointment>;
  edit(appointment: Appointment): Promise<Appointment>;
  findAppointmentsByDate(doctorId: string, date: Date): Promise<boolean>;
  findAppointmentsByDoctor(doctorId: string): Promise<Appointment[]>;
  findAll():Promise<Appointment[]>;
}