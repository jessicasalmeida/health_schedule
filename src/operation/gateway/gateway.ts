
import { AppointmentDTO } from '../../common/dto/dto';
import { NotFoundError } from '../../common/errors/not-found-error';
import { AppointmentRepository } from '../../common/interfaces/appointment-data-source';
import { Appointment } from '../../core/entities/appointment';

export class Gateway {
    dataSource: AppointmentRepository;
    constructor(dataSource: AppointmentRepository) {
        this.dataSource = dataSource;
    }

    async save(entity: Appointment): Promise<Appointment> {

        const appointmentDTO: AppointmentDTO =
        {
            id: entity.id,
            doctorId: entity.doctorId,
            patientId: entity.patientId,
            date: entity.date,
            status: entity.status
        };

        const sucesso = await this.dataSource.save(appointmentDTO);
        return sucesso;
    }

    async findById(id: string): Promise<Appointment> {
        const data = await this.dataSource.findById(id);
        if (data) {
            const dataEntity = new Appointment(data.id, data.doctorId, data.patientId, data.date, data.status);
            return dataEntity;
        }
        throw new NotFoundError("Erro ao localizar Appointment");
    }

    async edit(object: Appointment): Promise<Appointment> {
        const data = await this.dataSource.edit(object);
        if (data) {
            const dataEntity = new Appointment(data.id, data.doctorId, data.patientId, data.date, data.status);
            return dataEntity;
        }
        throw new NotFoundError("Erro ao localizar Appointment");
    }

    async findAppointmentsByDate(doctorId: string, date: Date): Promise<boolean> {
        return await this.dataSource.findAppointmentsByDate(doctorId, date);
    }

    async findAppointmentsByDoctor(doctorId: string): Promise<Appointment[]> {
        let dataEntity: Array<Appointment> = new Array();
        const data = await this.dataSource.findAppointmentsByDoctor(doctorId);
        if (data) {
            data.forEach(data => {
                dataEntity.push(new Appointment(data.id, data.doctorId, data.patientId, data.date, data.status))
            });
        }
        return dataEntity;
    }


    async findAll(): Promise<Appointment[]> {

        let dataEntity: Array<Appointment> = new Array();
        const data = await this.dataSource.findAll();
        if (data) {
            data.forEach(data => {
                dataEntity.push(new Appointment(data.id, data.doctorId, data.patientId, data.date, data.status))
            });
        }
        return dataEntity;
    }
}