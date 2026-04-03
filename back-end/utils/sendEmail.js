import nodemailer from 'nodemailer';
import { fileURLToPath } from 'url';
import fs from 'fs';

const logoUrl = new URL('../../front-end/public/favicon.svg', import.meta.url);
const logoPath = fileURLToPath(logoUrl);

const escapeHtml = (value = '') =>
    String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');

const formatTextAsHtml = (text = '') =>
    escapeHtml(text).replace(/\n/g, '<br />');

const buildEmailTemplate = ({ subject, text }) => `
    <div style="margin:0;padding:24px 0;background:#f3f7fb;font-family:Segoe UI,Tahoma,Arial,sans-serif;color:#172033;">
        <div style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid rgba(148,163,184,0.18);border-radius:20px;overflow:hidden;box-shadow:0 18px 50px rgba(15,23,42,0.08);">
            <div style="padding:28px 32px;background:linear-gradient(135deg,#06b6d4 0%,#3b82f6 100%);color:#ffffff;">
                <div style="display:flex;align-items:center;gap:14px;">
                    <img src="cid:chatweb-logo" alt="ChatWeb Logo" style="width:52px;height:52px;display:block;border-radius:14px;background:rgba(255,255,255,0.16);padding:6px;" />
                    <div>
                        <div style="font-size:22px;font-weight:700;line-height:1.2;">ChatWeb</div>
                        <div style="font-size:13px;opacity:0.92;margin-top:4px;">Secure messaging, friend connections, and account support</div>
                    </div>
                </div>
            </div>

            <div style="padding:30px 32px 20px;">
                <div style="font-size:20px;font-weight:700;line-height:1.35;color:#0f172a;margin-bottom:14px;">
                    ${escapeHtml(subject)}
                </div>

                <div style="font-size:14px;line-height:1.75;color:#334155;">
                    ${formatTextAsHtml(text)}
                </div>

                <div style="margin-top:24px;padding:18px 20px;border-radius:16px;background:#f8fbff;border:1px solid rgba(8,145,178,0.14);">
                    <div style="font-size:14px;font-weight:700;color:#0f172a;margin-bottom:8px;">Why you received this email</div>
                    <div style="font-size:13px;line-height:1.7;color:#475569;">
                        This message was sent from ChatWeb regarding your account activity, security, or app access.
                        If you use ChatWeb for personal conversations, friend requests, and media sharing, these emails help you stay informed and protected.
                    </div>
                </div>

                <div style="margin-top:16px;padding:18px 20px;border-radius:16px;background:#fff7ed;border:1px solid rgba(249,115,22,0.14);">
                    <div style="font-size:14px;font-weight:700;color:#7c2d12;margin-bottom:8px;">Security note</div>
                    <div style="font-size:13px;line-height:1.7;color:#9a3412;">
                        Never share your OTP, password, or login token with anyone.
                        ChatWeb support will never ask for your password by email.
                        If this activity was not initiated by you, please secure your account immediately and contact support.
                    </div>
                </div>
            </div>

            <div style="padding:18px 32px 26px;border-top:1px solid rgba(148,163,184,0.18);background:#f8fafc;">
                <div style="font-size:13px;font-weight:700;color:#0f172a;margin-bottom:6px;">About ChatWeb</div>
                <div style="font-size:12px;line-height:1.75;color:#64748b;">
                    ChatWeb is designed to help users chat with friends, manage requests, share voice notes and images, and stay connected in a clean, modern messaging environment.
                </div>
                <div style="font-size:11px;line-height:1.7;color:#94a3b8;margin-top:12px;">
                    Please do not reply to this automated email. This mailbox may not be monitored.
                </div>
            </div>
        </div>
    </div>
`;

export const sendEmail = async (to, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
            connectionTimeout: 10000,
            greetingTimeout: 10000,
            socketTimeout: 15000,
        });

        const attachments = fs.existsSync(logoPath)
            ? [
                  {
                      filename: 'chatweb-logo.svg',
                      path: logoPath,
                      cid: 'chatweb-logo',
                  },
              ]
            : [];

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject,
            text,
            html: buildEmailTemplate({ subject, text }),
            attachments,
        };

        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send email');
    }
};
