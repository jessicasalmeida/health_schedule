import { AppointmentDTO } from "../../common/dto/dto";
import { Appointment } from "../../core/entities/appointment";

export class Presenter {
    static toDTO(
        presenter: Appointment
    ): Appointment {
        let dto: AppointmentDTO = {
            id: presenter.id,
            doctorId: presenter.doctorId,
            patientId: presenter.patientId,
            date: presenter.date,
            status: presenter.status
        };
        return dto;
    }
}
