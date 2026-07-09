import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(private config: ConfigService) {}

  private async send(to: string, subject: string, html: string) {
    const match = html.match(/\b(\d{6})\b/);
    this.logger.log(`📧 TO: ${to} | ${subject}${match ? ' | КОД: ' + match[1] : ''}`);

    const apiKey = this.config.get('RESEND_API_KEY');
    const from = this.config.get('MAIL_FROM') || 'UpDown Platform <onboarding@resend.dev>';

    if (!apiKey) {
      this.logger.warn('RESEND_API_KEY не задан — письмо не отправлено, код в логе выше');
      return;
    }

    try {
      await axios.post(
        'https://api.resend.com/emails',
        { from, to, subject, html },
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          timeout: 10000,
        },
      );
      this.logger.log(`✅ Email отправлен на ${to}`);
    } catch (e) {
      const msg = e.response?.data?.message || e.message;
      this.logger.warn(`⚠️ Email не отправлен (${msg}) — код в логе выше`);
    }
  }

  async sendVerificationCode(email: string, code: string) {
    await this.send(
      email,
      'Email Verification Code',
      `<h2>Your verification code: <strong>${code}</strong></h2>
       <p>Code expires in ${this.config.get('CODE_TTL_MINUTES', '10')} minutes.</p>`,
    );
  }

  async sendLoginCode(email: string, code: string) {
    await this.send(
      email,
      'Login Verification Code',
      `<h2>Your login code: <strong>${code}</strong></h2>
       <p>Code expires in 10 minutes. If you didn't request this, ignore this email.</p>`,
    );
  }

  async sendEmailChangeCode(email: string, code: string) {
    await this.send(
      email,
      'Confirm Email Change',
      `<h2>Confirm your new email address</h2>
       <p>Your verification code: <strong>${code}</strong></p>
       <p>Expires in 10 minutes.</p>`,
    );
  }

  async sendPartnerApplication(data: {
    name: string;
    email: string;
    companyName: string;
    description: string;
  }) {
    await this.send(
      this.config.get('MAIL_ADMIN'),
      'New Partner Application',
      `<h2>New Partner Application</h2>
       <p><b>Name:</b> ${data.name}</p>
       <p><b>Email:</b> ${data.email}</p>
       <p><b>Company:</b> ${data.companyName}</p>
       <p><b>Description:</b> ${data.description}</p>`,
    );
  }

  async sendPasswordResetCode(email: string, code: string) {
    await this.send(
      email,
      'Password Reset Code',
      `<h2>Password Reset</h2>
       <p>Your reset code: <strong>${code}</strong></p>
       <p>Expires in ${this.config.get('CODE_TTL_MINUTES', '10')} minutes. If you didn't request this, ignore this email.</p>`,
    );
  }

  async sendPartnerStatusUpdate(email: string, status: string, reason?: string) {
    const isApproved = status === 'approved';
    await this.send(
      email,
      `Partner Application ${isApproved ? 'Approved' : 'Rejected'}`,
      `<h2>Your partner application has been ${status}</h2>
       ${reason ? `<p><b>Reason:</b> ${reason}</p>` : ''}
       ${isApproved ? '<p>You can now log in and set up your Telegram bot.</p>' : ''}`,
    );
  }
}
