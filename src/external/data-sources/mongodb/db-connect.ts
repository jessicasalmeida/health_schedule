import * as mongoDB from "mongodb";
import * as dotenv from "dotenv";
import { Appointment } from "../../../core/entities/appointment";

export const collections : {
    appointment?: mongoDB.Collection<Appointment>} = {};

export async function connectToDataBase()
{
    dotenv.config();
    const client = new mongoDB.MongoClient(process.env.DB_CONN_STRING as string);
    await client.connect();
    const db = client.db(process.env.DB_NAME);
    const appointmentCollection = db.collection<Appointment>(process.env.APPOINTMENT_COLLECTION_NAME as string);

    collections.appointment = appointmentCollection;

    console.log(`Conexão :` + process.env.DB_CONN_STRING as string);
}