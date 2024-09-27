"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Appointment = void 0;
class Appointment {
    constructor(_id, doctorId, patientId, date, status) {
        this._id = _id;
        this.doctorId = doctorId;
        this.patientId = patientId;
        this.date = date;
        this.status = status;
    }
}
exports.Appointment = Appointment;
