export class EmailSender {
    async send(to: string, subject: string, body: string) {
      console.log(`Sending email to ${to}: ${subject} - ${body}`);
      // Implement actual email service integration here, e.g., nodemailer
    }
  }
  