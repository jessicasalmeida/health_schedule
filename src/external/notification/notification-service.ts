import AWS from 'aws-sdk';
import { UnsubscribeInput } from 'aws-sdk/clients/sns';
import * as dotenv from "dotenv";

// Carregar variáveis de ambiente
dotenv.config();

// Configurando o SNS com as credenciais e região AWS
AWS.config.update({
  region: process.env.AWS_REGION, // Ex: 'us-east-1'
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  sessionToken: process.env.AWS_SESSION_TOKEN,
});

const sns = new AWS.SNS({ apiVersion: '2010-03-31' });

export class EmailNotificationService {
  async notifyDoctor(doctorEmail: string, doctorName: string, patientName: string, appointmentDate: Date): Promise<void> {
    const message = `Olá, Dr. ${doctorName}!\n\nVocê tem uma nova consulta marcada!\n\nPaciente: ${patientName}.\nData e horário: ${appointmentDate}.`;

    const subscribeParams = {
      TopicArn: "arn:aws:sns:us-east-1:477520350695:teste",
      Protocol: "email",
      Endpoint: doctorEmail, // Endereço de e-mail do médico
      ReturnSubscriptionArn: true
    };

    const params = {
      Message: message,
      Subject: 'Health&Med - Nova consulta agendada',
      MessageStructure: message,
      TopicArn: "arn:aws:sns:us-east-1:477520350695:teste", // Não é necessário o ARN do tópico
    };



    try {
      const subscribePromise = await sns.subscribe(subscribeParams).promise();
      console.log("Subscription ARN is " + subscribePromise.SubscriptionArn);

      const result = await sns.publish(params).promise();
      //await sns.unsubscribe(unsubscribe);
      console.log('Notificação enviada via SNS:', result.MessageId);

      const unsubscribe = await sns.unsubscribe({ SubscriptionArn: subscribePromise.SubscriptionArn!.toString() }).promise();
      console.log("Subscription ARN is " + subscribePromise.SubscriptionArn);

    } catch (error) {
      console.error('Erro ao enviar notificação por e-mail via SNS:', error);
      throw new Error('Erro ao enviar notificação por e-mail');
    }
  }
}
