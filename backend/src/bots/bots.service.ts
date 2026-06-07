import {
  Injectable,
  BadRequestException,
  NotFoundException,
  OnModuleInit,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios from 'axios';
import { Bot, BotStatus } from '../database/entities/bot.entity';
import { BotUser } from '../database/entities/bot-user.entity';
import { LinkClick } from '../database/entities/link-click.entity';
import { Partner } from '../database/entities/partner.entity';
import { PartnerBotService } from '../telegram/partner-bot.service';

@Injectable()
export class BotsService implements OnModuleInit {
  constructor(
    @InjectRepository(Bot) private botRepo: Repository<Bot>,
    @InjectRepository(BotUser) private botUserRepo: Repository<BotUser>,
    @InjectRepository(LinkClick) private clickRepo: Repository<LinkClick>,
    @InjectRepository(Partner) private partnerRepo: Repository<Partner>,
    private partnerBotService: PartnerBotService,
  ) {}

  async onModuleInit() {
    // Перерегистрируем webhook у всех RUNNING-ботов при рестарте сервера.
    // Троттлим, чтобы не упереться в лимиты Telegram при большом числе ботов.
    const bots = await this.botRepo.find({ where: { status: BotStatus.RUNNING } });
    for (const bot of bots) {
      try {
        await this.partnerBotService.startBot(bot);
        await new Promise((r) => setTimeout(r, 200));
      } catch {}
    }
  }

  private async getPartnerIdForUser(userId: string): Promise<string> {
    const partner = await this.partnerRepo.findOne({ where: { userId } });
    if (!partner) throw new ForbiddenException('Not a partner');
    return partner.id;
  }

  async setToken(userId: string, token: string) {
    const partnerId = await this.getPartnerIdForUser(userId);

    // Validate token with Telegram
    let botInfo: any;
    try {
      const response = await axios.get(`https://api.telegram.org/bot${token}/getMe`);
      botInfo = response.data.result;
    } catch {
      throw new BadRequestException('Invalid Telegram bot token');
    }

    // Stop existing bot if any
    let bot = await this.botRepo.findOne({ where: { partnerId } });
    if (bot) {
      await this.partnerBotService.stopBot(bot.id);
      bot.token = token;
      bot.username = botInfo.username;
      bot.name = botInfo.first_name;
      bot.status = BotStatus.INACTIVE;
    } else {
      bot = this.botRepo.create({
        partnerId,
        token,
        username: botInfo.username,
        name: botInfo.first_name,
        buttonUrls: [],
      });
    }

    await this.botRepo.save(bot);
    return bot;
  }

  async startBot(userId: string) {
    const partnerId = await this.getPartnerIdForUser(userId);
    const bot = await this.botRepo.findOne({ where: { partnerId } });
    if (!bot) throw new NotFoundException('Bot not configured');

    await this.partnerBotService.startBot(bot);
    return this.getMyBot(userId);
  }

  async stopBot(userId: string) {
    const partnerId = await this.getPartnerIdForUser(userId);
    const bot = await this.botRepo.findOne({ where: { partnerId } });
    if (!bot) throw new NotFoundException();

    await this.partnerBotService.stopBot(bot.id);
    await this.botRepo.update(bot.id, { status: BotStatus.INACTIVE });
    return { status: BotStatus.INACTIVE };
  }

  async getMyBot(userId: string) {
    const partnerId = await this.getPartnerIdForUser(userId);
    const bot = await this.botRepo.findOne({ where: { partnerId } });
    if (!bot) return null;

    const conversion = bot.totalUsers > 0
      ? ((bot.totalClicks / bot.totalUsers) * 100).toFixed(2)
      : '0.00';

    return { ...bot, conversion: parseFloat(conversion) };
  }

  async updateButtonUrls(
    userId: string,
    buttonUrls: { label: string; url: string }[],
  ) {
    const partnerId = await this.getPartnerIdForUser(userId);
    const bot = await this.botRepo.findOne({ where: { partnerId } });
    if (!bot) throw new NotFoundException();
    if (buttonUrls.length > 6) throw new BadRequestException('Max 6 buttons');

    await this.botRepo.update(bot.id, { buttonUrls });
    return this.getMyBot(userId);
  }

  // Whitelist получателей бота: кому он отвечает на команды (пусто = всем)
  async updateRecipients(userId: string, allowedRecipients: string[]) {
    const partnerId = await this.getPartnerIdForUser(userId);
    const bot = await this.botRepo.findOne({ where: { partnerId } });
    if (!bot) throw new NotFoundException();
    const cleaned = (allowedRecipients || [])
      .map((s) => String(s).trim())
      .filter(Boolean)
      .slice(0, 100);
    await this.botRepo.update(bot.id, { allowedRecipients: cleaned });
    return this.getMyBot(userId);
  }

  // Точка входа webhook — вызывается контроллером (без JWT, внешний запрос Telegram)
  async handleWebhook(botId: string, secret: string, update: any) {
    await this.partnerBotService.handleUpdate(botId, secret, update);
    return { ok: true };
  }

  async getAllBots() {
    return this.botRepo.find({
      relations: ['partner', 'partner.user'],
      order: { createdAt: 'DESC' },
    });
  }

  async getBotById(id: string) {
    return this.botRepo.findOne({ where: { id }, relations: ['partner'] });
  }
}
