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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailNotificationService = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
class EmailNotificationService {
    // logic for sending emails will go here
    notifyDoctor(doctorEmail, doctorName, patientName, appointmentDate) {
        return __awaiter(this, void 0, void 0, function* () {
            const message = `Olá, Dr. ${doctorName}!\n\nVocê tem uma nova consulta marcada!\n\nPaciente: ${patientName}.\nData e horário: ${appointmentDate}.`;
            {
                var transporter = nodemailer_1.default.createTransport({
                    host: 'smtp.gmail.com',
                    port: 587,
                    auth: {
                        user: process.env.GOOGLE_MAIL_APP_EMAIL,
                        pass: process.env.GOOGLE_MAIL_APP_PASSWORD,
                    }
                });
                var mailOptions = {
                    from: process.env.GOOGLE_MAIL_APP_EMAIL,
                    to: doctorEmail,
                    subject: "Notifificacao NotificationSender",
                    html: message,
                };
                try {
                    yield transporter.sendMail(mailOptions);
                }
                catch (error) {
                    console.error("error sending email ", error);
                }
            }
        });
    }
}
exports.EmailNotificationService = EmailNotificationService;
