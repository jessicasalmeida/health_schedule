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
exports.Gateway = void 0;
const not_found_error_1 = require("../../common/errors/not-found-error");
const appointment_1 = require("../../core/entities/appointment");
class Gateway {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    save(entity) {
        return __awaiter(this, void 0, void 0, function* () {
            const appointmentDTO = {
                _id: entity._id,
                doctorId: entity.doctorId,
                patientId: entity.patientId,
                date: entity.date,
                status: entity.status
            };
            const sucesso = yield this.dataSource.save(appointmentDTO);
            return sucesso;
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.dataSource.findById(id);
            if (data) {
                const dataEntity = new appointment_1.Appointment(data._id, data.doctorId, data.patientId, data.date, data.status);
                return dataEntity;
            }
            throw new not_found_error_1.NotFoundError("Erro ao localizar Appointment");
        });
    }
    edit(object) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.dataSource.edit(object);
            if (data) {
                const dataEntity = new appointment_1.Appointment(data._id, data.doctorId, data.patientId, data.date, data.status);
                return dataEntity;
            }
            throw new not_found_error_1.NotFoundError("Erro ao localizar Appointment");
        });
    }
    findAppointmentsByDate(doctorId, date) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.dataSource.findAppointmentsByDate(doctorId, date);
        });
    }
    findAppointmentsByDoctor(doctorId) {
        return __awaiter(this, void 0, void 0, function* () {
            let dataEntity = new Array();
            const data = yield this.dataSource.findAppointmentsByDoctor(doctorId);
            if (data) {
                data.forEach(data => {
                    dataEntity.push(new appointment_1.Appointment(data._id, data.doctorId, data.patientId, data.date, data.status));
                });
            }
            return dataEntity;
        });
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            let dataEntity = new Array();
            const data = yield this.dataSource.findAll();
            if (data) {
                data.forEach(data => {
                    dataEntity.push(new appointment_1.Appointment(data._id, data.doctorId, data.patientId, data.date, data.status));
                });
            }
            return dataEntity;
        });
    }
}
exports.Gateway = Gateway;
