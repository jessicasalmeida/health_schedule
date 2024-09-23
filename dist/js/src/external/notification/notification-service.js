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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailNotificationService = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const dotenv = __importStar(require("dotenv"));
// Carregar variáveis de ambiente
dotenv.config();
// Configurando o SNS com as credenciais e região AWS
aws_sdk_1.default.config.update({
    region: process.env.AWS_REGION, // Ex: 'us-east-1'
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    sessionToken: process.env.AWS_SESSION_TOKEN,
});
const sns = new aws_sdk_1.default.SNS({ apiVersion: '2010-03-31' });
class EmailNotificationService {
    notifyDoctor(doctorEmail, doctorName, patientName, appointmentDate) {
        return __awaiter(this, void 0, void 0, function* () {
            const message = `Olá, Dr. ${doctorName}!\n\nVocê tem uma nova consulta marcada!\n\nPaciente: ${patientName}.\nData e horário: ${appointmentDate}.`;
            const subscribeParams = {
                TopicArn: (process.env.SNS_ARN),
                Protocol: "email",
                Endpoint: doctorEmail, // Endereço de e-mail do médico
                ReturnSubscriptionArn: true
            };
            const params = {
                Message: message,
                Subject: 'Health&Med - Nova consulta agendada',
                MessageStructure: message,
                TopicArn: (process.env.SNS_ARN),
            };
            try {
                const subscribePromise = yield sns.subscribe(subscribeParams).promise();
                console.log("Subscription ARN is " + subscribePromise.SubscriptionArn);
                const result = yield sns.publish(params).promise();
                //await sns.unsubscribe(unsubscribe);
                console.log('Notificação enviada via SNS:', result.MessageId);
                const unsubscribe = yield sns.unsubscribe({ SubscriptionArn: subscribePromise.SubscriptionArn.toString() }).promise();
                console.log("Subscription ARN is " + subscribePromise.SubscriptionArn);
            }
            catch (error) {
                console.error('Erro ao enviar notificação por e-mail via SNS:', error);
                throw new Error('Erro ao enviar notificação por e-mail');
            }
        });
    }
}
exports.EmailNotificationService = EmailNotificationService;
