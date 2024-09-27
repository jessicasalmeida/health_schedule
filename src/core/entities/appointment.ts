export class Appointment {
    constructor(
      public _id: string,
      public doctorId: string,
      public patientId: string,
      public date: Date,
      public status: boolean
    ) {}
  }
  