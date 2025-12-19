import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Friendship } from './entities/friendship.entity';
import { Message } from './entities/message.entity';
import { SocialController } from './social.controller';
import { SocialService } from './social.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Friendship, Message, User]),
  ],
  controllers: [SocialController],
  providers: [SocialService],
})
export class SocialModule {}