import { ScheduleAppointmentUseCase } from "../../core/usercases/appointment-use-case";
import { Request, Response } from 'express';

export class ScheduleController {
  constructor(
    private useCase: ScheduleAppointmentUseCase,
  ) { }

  async reserve(req: Request, res: Response) {
    try {
      const paciente = req.body.paciente;
      const idAppointment = req.body.idAppointment;

      await this.useCase.reserveAppointment(paciente, idAppointment);
      res.status(200).json("Horários criados com sucesso");
    } catch (e) {
      res.status(400).json({ message: (e as Error).message });
    }
  }
}
