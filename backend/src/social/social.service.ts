import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { SendMessageDto } from './dto/social.dto';
import { Friendship } from './entities/friendship.entity';
import { Message } from './entities/message.entity';

@Injectable()
export class SocialService {
  constructor(
    @InjectRepository(Friendship)
    private friendshipRepository: Repository<Friendship>,
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // --- FRIENDSHIPS ---

  async sendFriendRequest(senderId: number, receiverId: number): Promise<Friendship> {
    if (senderId === receiverId) throw new BadRequestException("You can't add yourself");

    const existing = await this.friendshipRepository.findOne({
      where: [
        { requesterId: senderId, receiverId: receiverId },
        { requesterId: receiverId, receiverId: senderId }, // Vérifier les deux sens
      ],
    });

    if (existing) {
        if (existing.status === 'ACCEPTED') throw new BadRequestException('Already friends');
        if (existing.status === 'PENDING') throw new BadRequestException('Request already pending');
    }

    const request = this.friendshipRepository.create({
      requesterId: senderId,
      receiverId: receiverId,
      status: 'PENDING',
    });

    return this.friendshipRepository.save(request);
  }

  async getPendingRequests(userId: number): Promise<Friendship[]> {
    return this.friendshipRepository.find({
      where: { receiverId: userId, status: 'PENDING' },
      relations: ['requester'],
    });
  }

  async getFriends(userId: number): Promise<Friendship[]> {
    return this.friendshipRepository.find({
      where: { requesterId: userId, status: 'ACCEPTED' },
      relations: ['receiver'], // On récupère les infos de l'ami
    });
  }

  async acceptFriendRequest(userId: number, requestId: number): Promise<void> {
    const request = await this.friendshipRepository.findOne({ 
        where: { id: requestId },
        relations: ['requester', 'receiver'] // Charger pour avoir les IDs corrects
    });

    if (!request) throw new NotFoundException('Request not found');
    if (request.receiverId !== userId) throw new BadRequestException('Not authorized');

    //Mettre à jour la demande originale (Requester -> Receiver)
    request.status = 'ACCEPTED';
    await this.friendshipRepository.save(request);

    // On vérifie d'abord si elle existe (au cas où)
    const reverseParams = { requesterId: userId, receiverId: request.requesterId };
    let reverseRelation = await this.friendshipRepository.findOne({ where: reverseParams });

    if (!reverseRelation) {
        reverseRelation = this.friendshipRepository.create({
            ...reverseParams,
            status: 'ACCEPTED'
        });
    } else {
        reverseRelation.status = 'ACCEPTED';
    }
    
    await this.friendshipRepository.save(reverseRelation);
  }

  async rejectFriendRequest(userId: number, requestId: number): Promise<void> {
      // Suppression physique de la demande
      const result = await this.friendshipRepository.delete({ id: requestId, receiverId: userId });
      if (result.affected === 0) throw new NotFoundException('Request not found');
  }

  // --- MESSAGING ---

  async sendMessage(senderId: number, dto: SendMessageDto): Promise<Message> {
    const receiver = await this.userRepository.findOneBy({ id: dto.receiverId });
    if (!receiver) throw new NotFoundException('Receiver not found');

    const message = this.messageRepository.create({
      sender: { id: senderId } as User,
      receiver: receiver,
      content: dto.content,
    });

    return this.messageRepository.save(message);
  }

  async getConversation(userId1: number, userId2: number): Promise<Message[]> {
    return this.messageRepository.find({
      where: [
        { sender: { id: userId1 }, receiver: { id: userId2 } },
        { sender: { id: userId2 }, receiver: { id: userId1 } },
      ],
      order: { createdAt: 'ASC' },
      relations: ['sender'],
    });
  }

  async getSentRequests(userId: number) {
    return this.friendshipRepository.find({
      where: { requester: { id: userId }, status: 'PENDING' },
      relations: ['receiver'], // On veut savoir À QUI on a envoyé
    });
  }

  //Annuler une demande (par ID de la demande)
  async cancelRequest(requestId: number, userId: number) {
    // On vérifie que c'est bien l'utilisateur qui annule SA demande
    const request = await this.friendshipRepository.findOne({
        where: { id: requestId, requester: { id: userId } }
    });
    if (request) {
        return this.friendshipRepository.remove(request);
    }
  }

  //Supprimer un ami (Rupture de l'amitié)
  async removeFriend(userId: number, friendId: number) {
    // On cherche la relation dans les deux sens (A vers B ou B vers A) qui est ACCEPTED
    const request = await this.friendshipRepository.findOne({
      where: [
        { requester: { id: userId }, receiver: { id: friendId }, status: 'ACCEPTED' },
        { requester: { id: friendId }, receiver: { id: userId }, status: 'ACCEPTED' }
      ]
    });

    if (request) {
      return this.friendshipRepository.remove(request);
    }
  }
}