import app from "./server";
import { connectToDataBase } from "./external/data-sources/mongodb/db-connect";
import { AppointmentRepositoryImpl } from "./external/data-sources/mongodb/appointments-repository-mongo";
import { ScheduleAppointmentUseCase } from "./core/usercases/appointment-use-case";
import { RabbitMQ } from "./external/mq/mq";
import { EmailNotificationService } from "./external/notification/notification-service";

const port = 8001;
const mq = new RabbitMQ();
const repository = new AppointmentRepositoryImpl();
const notification = new EmailNotificationService();
const useCase = new ScheduleAppointmentUseCase(repository,notification, mq);

connectToDataBase()
    .then(()=> {
        app.listen(port, () => {
            console.log(`Server is listening on port: ${port}`)
        });
    })
    
.catch((error: Error) => {
    console.error("Database connection failed", error);
    process.exit();
});