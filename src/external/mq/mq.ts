// src/infrastructure/RabbitMQ.ts
import amqp, { Connection, Channel } from 'amqplib';
import * as dotenv from "dotenv";

export class RabbitMQ {
  private connection!: Connection;
  private channel!: Channel;

  async connect(): Promise<void> {
    dotenv.config();
    this.connection = await amqp.connect(process.env.MQ_CONN_STRING as string);
    this.channel = await this.connection.createChannel();
  }

  async publish(queue: string, message: any): Promise<void> {
    await this.channel.assertQueue(queue, { durable: true });
    this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
  }

  async consume(queue: string, callback: (msg: any) => void): Promise<void> {
    await this.channel.assertQueue(queue, { durable: true });
    this.channel.consume(queue, (msg) => {
      if (msg !== null) {
        const content = JSON.parse(msg.content.toString());
        callback(content);
        this.channel.ack(msg);
      }
    });
  }

  async close(): Promise<void> {
    await this.channel.close();
    await this.connection.close();
  }
}
