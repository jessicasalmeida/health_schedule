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
exports.AppointmentRepositoryImpl = void 0;
const mongodb_1 = require("mongodb");
const db_connect_1 = require("./db-connect");
class AppointmentRepositoryImpl {
    save(appointment) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const savedAppointment = yield ((_a = db_connect_1.collections.appointment) === null || _a === void 0 ? void 0 : _a.insertOne(appointment));
            return savedAppointment;
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const query = { _id: new mongodb_1.ObjectId(id) };
            const savedAppointment = yield ((_a = db_connect_1.collections.appointment) === null || _a === void 0 ? void 0 : _a.find({}, { projection: query }));
            return savedAppointment;
        });
    }
    edit(appointment) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const query = { _id: (appointment._id) };
            const savedAppointment = yield ((_a = db_connect_1.collections.appointment) === null || _a === void 0 ? void 0 : _a.updateOne(query, { $set: appointment }));
            return savedAppointment;
        });
    }
    findAppointmentsByDate(doctorId, date) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const start = date;
            const end = new Date(date);
            console.log(start);
            end.setMinutes(end.getMinutes() + 30); // Define o final do intervalo como 30 minutos após o início
            console.log(end);
            // Verifica se há algum agendamento que se sobrepõe ao intervalo desejado
            const conflict = yield ((_a = db_connect_1.collections.appointment) === null || _a === void 0 ? void 0 : _a.findOne({
                doctorId: doctorId,
                date: {
                    $lt: end, // Horários com início antes do final desejado
                    $gte: start // Horários com início no mesmo intervalo ou posterior
                }
            }));
            return !conflict;
        });
    }
    findAppointmentsByDoctor(doctorId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const query = { doctorId: (doctorId) };
            const appointments = yield ((_a = db_connect_1.collections.appointment) === null || _a === void 0 ? void 0 : _a.find(query));
            return appointments;
        });
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            return yield ((_a = db_connect_1.collections.appointment) === null || _a === void 0 ? void 0 : _a.find({}).toArray());
        });
    }
}
exports.AppointmentRepositoryImpl = AppointmentRepositoryImpl;
