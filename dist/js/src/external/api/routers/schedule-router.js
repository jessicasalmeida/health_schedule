"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.router = void 0;
const express_1 = __importStar(require("express"));
const mq_1 = require("../../mq/mq");
const appointments_repository_mongo_1 = require("../../data-sources/mongodb/appointments-repository-mongo");
const notification_service_1 = require("../../notification/notification-service");
const appointment_use_case_1 = require("../../../core/usercases/appointment-use-case");
const schedule_controller_1 = require("../../../operation/controllers/schedule-controller");
const gateway_1 = require("../../../operation/gateway/gateway");
const mq = new mq_1.RabbitMQ();
const repository = new appointments_repository_mongo_1.AppointmentRepositoryImpl();
const notification = new notification_service_1.EmailNotificationService();
const gateway = new gateway_1.Gateway(repository);
const useCase = new appointment_use_case_1.ScheduleAppointmentUseCase(gateway, notification, mq);
const controller = new schedule_controller_1.ScheduleController(useCase);
exports.router = (0, express_1.Router)();
exports.router.use(express_1.default.json());
exports.router.post('/reserve', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    /*  #swagger.tags = ['Doctor']
        #swagger.summary = 'Create'
        #swagger.description = 'Endpoint to create a doctor' */
    const order = yield controller.reserve(req, res);
}));
