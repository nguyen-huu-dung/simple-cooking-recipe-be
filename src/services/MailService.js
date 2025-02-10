/* eslint-disable @stylistic/js/object-curly-newline */
/* eslint-disable @stylistic/js/no-extra-parens */
require('dotenv').config();
import { createTransport } from 'nodemailer';
import { LoggerError, LoggerSystem } from '../helpers/logger';

class MailService {

    constructor() {
        // config mail
        this.smtpEndpoint = process.env.MAIL_SMTP_ENDPOINT;
        this.port = process.env.MAIL_SMTP_PORT;
        this.smtpUsername = process.env.MAIL_SMTP_USERNAME;
        this.smtpPassword = process.env.MAIL_SMTP_PASSWORD;
        this.senderAddress = process.env.MAIL_SENDER_ADDRESS;
    }

    async asyncSendMail({ to, cc, bcc, subject, text, html } = {}) {
        try {
            // kiểm tra điều kiện đầu vào
            if ((!to && !cc && !bcc) || (!text && !html)) return;

            // initialize a transporter to send mail
            const transporter = createTransport({
                host: this.smtpEndpoint,
                port: this.port,
                auth: {
                    user: this.smtpUsername,
                    pass: this.smtpPassword
                }

            });

            const mailOptions = {
                from: this.senderAddress,
                ...(to ? { to } : { }),
                ...(cc ? { cc } : { }),
                ...(bcc ? { bcc } : { }),
                subject,
                ...(text ? { text } : { }),
                ...(html ? { html } : { })
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    LoggerError.error('Error send mail', error);
                } else {
                    LoggerSystem.info('Email sent', to, bcc, subject, info.response);
                }
            });
        } catch (error) {
            LoggerError.error('Error send mail', error);
        }
    }
}

export default MailService;
