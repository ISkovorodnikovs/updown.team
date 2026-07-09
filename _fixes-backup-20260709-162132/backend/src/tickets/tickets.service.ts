import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Ticket,
  TicketMessage,
  TicketStatus,
} from '../database/entities/ticket.entity';
import { UserRole } from '../database/entities/user.entity';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationType } from '../database/entities/notification.entity';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket) private ticketRepo: Repository<Ticket>,
    @InjectRepository(TicketMessage)
    private messageRepo: Repository<TicketMessage>,
    private notifications: NotificationsService,
  ) {}

  async create(userId: string, subject: string, message: string) {
    const ticket = await this.ticketRepo.save({ userId, subject });
    await this.messageRepo.save({ ticketId: ticket.id, senderId: userId, message });
    await this.notifications.createForAdmins({
      type: NotificationType.TICKET,
      title: 'Новый тикет поддержки',
      body: subject,
      meta: { ticketId: ticket.id, link: `/dashboard/tickets/${ticket.id}` },
    });
    return ticket;
  }

  async getMyTickets(userId: string) {
    return this.ticketRepo.find({
      where: { userId },
      order: { updatedAt: 'DESC' },
    });
  }

  async getAllTickets(page = 1, limit = 20) {
    const [items, total] = await this.ticketRepo.findAndCount({
      relations: ['user'],
      order: { updatedAt: 'DESC' },
      take: limit,
      skip: (page - 1) * limit,
    });
    return { items, total };
  }

  async getTicket(ticketId: string, userId: string, role: UserRole) {
    const ticket = await this.ticketRepo.findOne({
      where: { id: ticketId },
      relations: ['user'],
    });
    if (!ticket) throw new NotFoundException();

    const isAdmin = [UserRole.ADMIN, UserRole.OWNER].includes(role);
    if (!isAdmin && ticket.userId !== userId) throw new ForbiddenException();

    return ticket;
  }

  async getMessages(ticketId: string, userId: string, role: UserRole) {
    const ticket = await this.ticketRepo.findOne({ where: { id: ticketId } });
    if (!ticket) throw new NotFoundException();

    const isAdmin = [UserRole.ADMIN, UserRole.OWNER].includes(role);
    if (!isAdmin && ticket.userId !== userId) throw new ForbiddenException();

    return this.messageRepo.find({
      where: { ticketId },
      relations: ['sender'],
      order: { createdAt: 'ASC' },
    });
  }

  async reply(ticketId: string, senderId: string, message: string, role: UserRole) {
    const ticket = await this.ticketRepo.findOne({ where: { id: ticketId } });
    if (!ticket) throw new NotFoundException();

    const isAdmin = [UserRole.ADMIN, UserRole.OWNER].includes(role);
    if (!isAdmin && ticket.userId !== senderId) throw new ForbiddenException();
    if (ticket.status === TicketStatus.CLOSED) throw new ForbiddenException('Ticket is closed');

    const msg = await this.messageRepo.save({ ticketId, senderId, message });
    await this.ticketRepo.update(ticketId, { updatedAt: new Date() });
    if (isAdmin) {
      // ответил админ → уведомляем владельца тикета
      await this.notifications.create(ticket.userId, {
        type: NotificationType.TICKET_REPLY,
        title: 'Ответ поддержки',
        body: ticket.subject,
        meta: { ticketId, link: `/dashboard/tickets/${ticketId}` },
      });
    } else {
      // ответил пользователь → уведомляем админов
      await this.notifications.createForAdmins({
        type: NotificationType.TICKET_REPLY,
        title: 'Ответ пользователя в тикете',
        body: ticket.subject,
        meta: { ticketId, link: `/dashboard/tickets/${ticketId}` },
      });
    }
    return msg;
  }

  async closeTicket(ticketId: string, role: UserRole) {
    if (![UserRole.ADMIN, UserRole.OWNER].includes(role)) throw new ForbiddenException();
    await this.ticketRepo.update(ticketId, { status: TicketStatus.CLOSED });
    return { status: TicketStatus.CLOSED };
  }
}
