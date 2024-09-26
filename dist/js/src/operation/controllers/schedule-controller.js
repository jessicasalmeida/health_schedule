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
exports.ScheduleController = void 0;
class ScheduleController {
    constructor(useCase) {
        this.useCase = useCase;
    }
    reserve(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const paciente = req.body.paciente;
                const idAppointment = req.body.idAppointment;
                yield this.useCase.reserveAppointment(paciente, idAppointment);
                res.status(200).json("Horários criados com sucesso");
            }
            catch (e) {
                res.status(400).json({ message: e.message });
            }
        });
    }
}
exports.ScheduleController = ScheduleController;
