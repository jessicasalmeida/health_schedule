"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./server"));
const db_connect_1 = require("./external/data-sources/mongodb/db-connect");
const appointments_repository_mongo_1 = require("./external/data-sources/mongodb/appointments-repository-mongo");
const appointment_use_case_1 = require("./core/usercases/appointment-use-case");
const mq_1 = require("./external/mq/mq");
const notification_service_1 = require("./external/notification/notification-service");
const port = 8001;
const mq = new mq_1.RabbitMQ();
const repository = new appointments_repository_mongo_1.AppointmentRepositoryImpl();
const notification = new notification_service_1.EmailNotificationService();
const useCase = new appointment_use_case_1.ScheduleAppointmentUseCase(repository, notification, mq);
(0, db_connect_1.connectToDataBase)()
    .then(() => {
    server_1.default.listen(port, () => {
        console.log(`Server is listening on port: ${port}`);
    });
})
    .catch((error) => {
    console.error("Database connection failed", error);
    process.exit();
});
