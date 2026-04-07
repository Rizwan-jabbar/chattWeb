import nodemailer from 'nodemailer';

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
                <div>
                    <div style="font-size:22px;font-weight:700;line-height:1.2;">ChatWeb</div>
                    <div style="font-size:13px;opacity:0.92;margin-top:4px;">Secure messaging, friend connections, and account support</div>
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

const parseBooleanEnv = (value, defaultValue) => {
    if (value === undefined || value === null || value === '') {
        return defaultValue;
    }

    return String(value).trim().toLowerCase() === 'true';
};

const buildTransportAttempts = ({ smtpUser, smtpPassword, smtpHost, smtpPort, smtpSecure }) => {
    if (smtpHost) {
        return [
            {
                label: `${smtpHost}:${smtpPort}`,
                config: {
                    host: smtpHost,
                    port: smtpPort,
                    secure: smtpSecure,
                    auth: {
                        user: smtpUser,
                        pass: smtpPassword,
                    },
                    tls: {
                        servername: smtpHost,
                    },
                },
            },
        ];
    }

    return [
        {
            label: 'gmail-service',
            config: {
                service: 'gmail',
                auth: {
                    user: smtpUser,
                    pass: smtpPassword,
                },
            },
        },
        {
            label: 'smtp.gmail.com:465',
            config: {
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                auth: {
                    user: smtpUser,
                    pass: smtpPassword,
                },
                tls: {
                    servername: 'smtp.gmail.com',
                },
            },
        },
        {
            label: 'smtp.gmail.com:587',
            config: {
                host: 'smtp.gmail.com',
                port: 587,
                secure: false,
                requireTLS: true,
                auth: {
                    user: smtpUser,
                    pass: smtpPassword,
                },
                tls: {
                    servername: 'smtp.gmail.com',
                },
            },
        },
    ];
};

const sendViaResend = async ({ to, subject, text, html, fromAddress }) => {
    const resendApiKey = String(process.env.RESEND_API_KEY || '').trim();

    if (!resendApiKey) {
        throw new Error('RESEND_API_KEY is not configured');
    }

    const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            from: fromAddress,
            to: [to],
            subject,
            text,
            html,
        }),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        console.error('Resend email failed:', {
            status: response.status,
            statusText: response.statusText,
            data,
        });

        throw new Error(data?.message || data?.error || 'Resend API request failed');
    }

    return data;
};

const sendViaSmtp = async ({ to, subject, text, html, fromAddress }) => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        throw new Error('Email credentials are not configured');
    }

    const smtpPassword = String(process.env.EMAIL_PASS).replace(/\s+/g, '').trim();
    const smtpUser = String(process.env.EMAIL_USER).trim();
    const smtpHost = String(process.env.SMTP_HOST || '').trim();
    const smtpPort = Number(process.env.SMTP_PORT || 465);
    const smtpSecure = parseBooleanEnv(process.env.SMTP_SECURE, true);
    const transportAttempts = buildTransportAttempts({
        smtpUser,
        smtpPassword,
        smtpHost,
        smtpPort,
        smtpSecure,
    });

    const mailOptions = {
        from: `"ChatWeb" <${fromAddress}>`,
        to,
        subject,
        text,
        html,
    };

    let lastError;

    for (const attempt of transportAttempts) {
        try {
            const transporter = nodemailer.createTransport({
                ...attempt.config,
                connectionTimeout: 10000,
                greetingTimeout: 10000,
                socketTimeout: 15000,
            });

            await transporter.verify();
            await transporter.sendMail(mailOptions);
            return;
        } catch (error) {
            lastError = error;
            console.error('Email transport attempt failed:', {
                attempt: attempt.label,
                message: error.message,
                code: error.code,
                command: error.command,
                response: error.response,
                responseCode: error.responseCode,
            });
        }
    }

    throw lastError || new Error('No email transport succeeded');
};

export const sendEmail = async (to, subject, text) => {
    try {
        const html = buildEmailTemplate({ subject, text });
        const resendFrom = String(process.env.RESEND_FROM || '').trim();
        const smtpFallbackFrom = String(process.env.EMAIL_FROM || process.env.EMAIL_USER || '').trim();
        const fromAddress = resendFrom || smtpFallbackFrom;

        if (!fromAddress) {
            throw new Error('Email sender is not configured');
        }

        if (process.env.RESEND_API_KEY) {
            await sendViaResend({
                to,
                subject,
                text,
                html,
                fromAddress,
            });
            return;
        }

        await sendViaSmtp({
            to,
            subject,
            text,
            html,
            fromAddress,
        });
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send email');
    }
};
