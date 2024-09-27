"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Presenter = void 0;
class Presenter {
    static toDTO(presenter) {
        let dto = {
            id: presenter.id,
            doctorId: presenter.doctorId,
            patientId: presenter.patientId,
            date: presenter.date,
            status: presenter.status
        };
        return dto;
    }
}
exports.Presenter = Presenter;
