"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScheduleAppointmentUseCase = void 0;
const conflict_error_1 = require("../../common/errors/conflict-error");
const not_found_error_1 = require("../../common/errors/not-found-error");
const mq_1 = require("../../external/mq/mq");
class ScheduleAppointmentUseCase {
    constructor(gateway, emailNotificationService, mq) {
        this.gateway = gateway;
        this.emailNotificationService = emailNotificationService;
        this.mq = mq;
        console.log("Listernes");
        this.listeners();
    }
    reserveAppointment(paciente, idAppointment) {
        return __awaiter(this, void 0, void 0, function* () {
            const appointment = yield this.gateway.findById(idAppointment);
            if (!appointment) {
                throw new not_found_error_1.NotFoundError("Appointment not founded");
            }
            console.log(appointment.status);
            if (!appointment.status) {
                throw new conflict_error_1.ConflictError('Horário já está ocupado.');
            }
            appointment.patientId = paciente._id;
            appointment.status = true;
            yield this.gateway.edit(appointment);
            let doctor;
            try {
                this.mq = new mq_1.RabbitMQ();
                yield this.mq.connect();
                console.log("Publicado getDoctor");
                doctor = (yield this.mq.publishExclusive('getDoctor', { id: appointment.doctorId }));
                yield this.mq.close();
            }
            catch (ConflictError) {
                throw new Error("Erro ao publicar mensagem");
            }
            this.emailNotificationService.notifyDoctor(doctor.email, doctor.name, paciente.name, appointment.date);
        });
    }
    newAppointment(appointments) {
        return __awaiter(this, void 0, void 0, function* () {
            this.mq = new mq_1.RabbitMQ();
            yield this.mq.connect();
            for (const appointment of appointments) {
                appointment.date = parseDate((appointment.date).toString());
                const listAppointments = yield this.findAppointmentsByDoctor(appointment.doctorId);
                const conflictItem = listAppointments.filter(a => appointment.date >= a.date && appointment.date <= new Date(a.date.getTime() + 1800000));
                if (conflictItem.length > 0) {
                    return false;
                }
                yield this.gateway.save(appointment);
            }
            return true;
        });
    }
    editAppointment(id, appointment) {
        return __awaiter(this, void 0, void 0, function* () {
            const olderAppointment = yield this.gateway.findById(id);
            if (!olderAppointment) {
                throw new not_found_error_1.NotFoundError("Appointment not founded");
            }
            yield this.gateway.edit(appointment);
        });
    }
    findAppointmentsByDoctor(doctorId) {
        return __awaiter(this, void 0, void 0, function* () {
            const lista = yield this.gateway.findAll();
            const filtered = lista.filter(a => a.doctorId === doctorId);
            return filtered;
        });
    }
    listeners() {
        return __awaiter(this, void 0, void 0, function* () {
            this.mq = new mq_1.RabbitMQ();
            yield this.mq.connect();
            yield this.mq.consume('newReserve', (message) => __awaiter(this, void 0, void 0, function* () {
                const paciente = message.paciente;
                const idAppointment = message.idAppointment;
                console.log("Fila newReserve: " + idAppointment);
                yield this.reserveAppointment(paciente, idAppointment);
            }));
            yield this.mq.consume('newAppointments', (message) => __awaiter(this, void 0, void 0, function* () {
                this.mq = new mq_1.RabbitMQ();
                yield this.mq.connect();
                const appointments = message.message.appointments;
                console.log("Fila newAppointments. Lenght: " + appointments.length);
                const resposta = yield this.newAppointment(appointments);
                console.log(resposta);
                yield this.mq.publishReply(message.replyTo, resposta, message.correlationId);
            }));
            yield this.mq.consume('editAppointment', (message) => __awaiter(this, void 0, void 0, function* () {
                this.mq = new mq_1.RabbitMQ();
                yield this.mq.connect();
                const appointment = message.appointment;
                const id = message.id;
                console.log("Fila editAppointment. ID: " + appointment.id);
                yield this.editAppointment(id, appointment);
            }));
            yield this.mq.consume('listAppointment', (message) => __awaiter(this, void 0, void 0, function* () {
                yield this.mq.connect();
                const id = message.message.id;
                console.log("Fila listAppointment. ID: " + id);
                yield this.mq.publishReply(message.replyTo, yield this.findAppointmentsByDoctor(id), message.correlationId);
            }));
        });
    }
}
exports.ScheduleAppointmentUseCase = ScheduleAppointmentUseCase;
function parseDate(dateString) {
    const [datePart, timePart] = dateString.split(' ');
    const [day, month, year] = datePart.split('/').map(Number);
    const [hours, minutes] = timePart.split(':').map(Number);
    // O mês é 0-indexado (Janeiro é 0)
    return new Date(year, month - 1, day, hours, minutes);
}
