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
exports.DoctorController = void 0;
class DoctorController {
    constructor(doctorUseCase, cognito) {
        this.doctorUseCase = doctorUseCase;
        this.cognito = cognito;
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const d = {
                    _id: req.body.id,
                    name: req.body.name,
                    password: req.body.password,
                    cpf: req.body.cpf,
                    crm: req.body.crm,
                    email: req.body.email,
                    idAws: "000"
                };
                const respostaCognito = yield this.cognito.createUser(d.email);
                yield this.cognito.setUserPassword(d.email, d.password);
                d.idAws = respostaCognito;
                const doctor = yield this.doctorUseCase.createDoctor(req.body);
                res.status(201).json(doctor);
            }
            catch (e) {
                res.status(400).json({ message: e.message });
            }
        });
    }
    schedule(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.doctorUseCase.schedule(req.body);
                res.status(200).json("Horários criados com sucesso");
            }
            catch (e) {
                res.status(400).json({ message: e.message });
            }
        });
    }
    editSchedule(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.doctorUseCase.editSchedule(req.params.id, req.body);
                res.status(200).json("Horários editados com sucesso");
            }
            catch (e) {
                res.status(400).json({ message: e.message });
            }
        });
    }
    listAppointments(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resposta = yield this.doctorUseCase.listAppointments(req.params.id);
                res.status(200).json(resposta);
            }
            catch (e) {
                res.status(400).json({ message: e.message });
            }
        });
    }
}
exports.DoctorController = DoctorController;
