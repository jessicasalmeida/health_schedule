import nodemailer from 'nodemailer'
import * as dotenv from "dotenv";
interface ISendMail {
  to: string
  subject: string
  message: string
}
export class EmailNotificationService {
  // logic for sending emails will go here

  async notifyDoctor(doctorEmail: string, doctorName: string, patientName: string, appointmentDate: Date): Promise<void> {
    dotenv.config();
    const message = `Olá, Dr. ${doctorName}!\n\nVocê tem uma nova consulta marcada!\n\nPaciente: ${patientName}.\nData e horário: ${appointmentDate}.`;
    {
      var transporter = nodemailer.createTransport({
        host: 'mail.smtp2go.com',
        port: 2525,
        auth: {
          user: process.env.GOOGLE_MAIL_APP_EMAIL,
          pass: process.env.GOOGLE_MAIL_APP_PASSWORD,
        }
      });

      var mailOptions = {
        from: "jessica.almeida@cpspos.sp.gov.br",
        to: doctorEmail,
        subject: "Consulta Agendada Fiap",
        html: message,
      };

      try {
        await transporter.sendMail(mailOptions)
        console.log("Email enviado")
      } catch (error) {
        console.error("error sending email ", error)
      }
    }

  }
}