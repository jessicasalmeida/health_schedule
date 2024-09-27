export type AppointmentDTO = {
  _id: string,
  doctorId: string,
  patientId: string,
  date: Date,
  status: boolean
}

export type DoctorDTO = {
  _id: string,
  name: string,
  cpf: string,
  crm: string,
  email: string,
  password: string
}

export type PacienteDTO = {
  _id: string,
  name: string,
  cpf: string,
  email: string,
  password: string
}