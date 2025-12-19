import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { PostsModule } from './posts/posts.module';
import { SkillsModule } from './skills/skills.module';
import { SocialModule } from './social/social.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root', 
      password: 'root', 
      database: 'sci_collab_db',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: false, // On utilise le script SQL pour gérer les migrations
    }),
    AuthModule,
    UsersModule,
    SkillsModule,
    PostsModule,
    SocialModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}