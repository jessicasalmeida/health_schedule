import express, { Router } from "express";

import { RabbitMQ } from "../../mq/mq";
import { AppointmentRepositoryImpl } from "../../data-sources/mongodb/appointments-repository-mongo";
import { EmailNotificationService } from "../../notification/notification-service";
import { ScheduleAppointmentUseCase } from "../../../core/usercases/appointment-use-case";
import { ScheduleController } from "../../../operation/controllers/schedule-controller";
const mq = new RabbitMQ();
const repository = new AppointmentRepositoryImpl();
const notification = new EmailNotificationService();
const useCase = new ScheduleAppointmentUseCase(repository,notification, mq);
const controller = new ScheduleController(useCase);

export const router = Router();

router.use(express.json());

router.post('/reserve', async (req, res) => {
    /*  #swagger.tags = ['Doctor']
        #swagger.summary = 'Create'
        #swagger.description = 'Endpoint to create a doctor' */
    const order = await controller.reserve(req, res);
});