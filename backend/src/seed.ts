import { NestFactory } from '@nestjs/core';
import { DataSource } from 'typeorm';
import { AppModule } from './app.module';
import { AuthService } from './auth/auth.service';
import { PostsService } from './posts/posts.service';
import { Skill } from './skills/entities/skill.entity';
import { SkillsService } from './skills/skills.service';
import { SocialService } from './social/social.service';
import { User } from './users/entities/user.entity';
import { UsersService } from './users/users.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  
  const authService = app.get(AuthService);
  const usersService = app.get(UsersService);
  const skillsService = app.get(SkillsService);
  const postsService = app.get(PostsService);
  const socialService = app.get(SocialService);
  const dataSource = app.get(DataSource);

  console.log('🌱 DÉBUT DU SEEDING...');

  //  Création des Skills
  const skillsData = ['Neuroscience', 'AI', 'Python', 'Biology', 'Quantum Physics', 'Data Science'];
  
  // CORRECTION ICI : On type explicitement le tableau
  const skills: Skill[] = [];
  
  for (const label of skillsData) {
    try {
      const skill = await skillsService.create({ label });
      skills.push(skill);
      console.log(`✅ Skill créé : ${label}`);
    } catch (e) {
      const existing = await skillsService.findAll();
      const found = existing.find(s => s.label === label);
      if (found) skills.push(found);
    }
  }

  // 2. Création des Utilisateurs
  const usersData = [
    { email: 'student@demo.com', password: 'password123', fullName: 'Etudiant Demo', institution: 'EPITECH', bio: 'Je présente mon projet de fin d\'année.' },
    { email: 'marie@science.com', password: 'password123', fullName: 'Marie Curie', institution: 'Sorbonne', bio: 'Passionnée par la radioactivité.' },
    { email: 'albert@science.com', password: 'password123', fullName: 'Albert Einstein', institution: 'Princeton', bio: 'Tout est relatif.' },
    { email: 'alan@turing.com', password: 'password123', fullName: 'Alan Turing', institution: 'Cambridge', bio: 'Les machines peuvent-elles penser ?' },
  ];

  // CORRECTION ICI : On type explicitement le tableau
  const userEntities: User[] = [];

  for (const u of usersData) {
    try {
      await authService.register(u);
      console.log(`✅ User créé : ${u.fullName}`);
    } catch (e) {
      console.log(`⚠️ User existe déjà : ${u.fullName}`);
    }
    
    // Récupération via le repository User
    const user = await dataSource.getRepository(User).findOne({ where: { email: u.email }, relations: ['skills'] });
    if (user) userEntities.push(user);
  }

  // Assignation propre
  // TypeScript sait maintenant que ce sont des objets User
  const [me, marie, albert, alan] = userEntities;

  // 3. Ajout des Skills aux Users
  // On ajoute des vérifications pour être sûr que les index existent
  if (me && skills.length > 2) {
    await usersService.addSkill(me.id, skills[1].id); // AI
    await usersService.addSkill(me.id, skills[2].id); // Python
  }
  if (albert && skills.length > 4) await usersService.addSkill(albert.id, skills[4].id); // Quantum
  if (alan && skills.length > 1) await usersService.addSkill(alan.id, skills[1].id); // AI

  // 4. Création des Posts
  if (marie && skills.length > 3) {
    await postsService.create(marie, { 
      title: 'Mes recherches sur le Radium', 
      content: 'C\'est brillant dans le noir !', 
      skillIds: [skills[3].id] 
    });
  }

  if (alan && skills.length > 1) {
    await postsService.create(alan, { 
      title: 'Intelligence Artificielle', 
      content: 'Je pense qu\'un jour les ordinateurs pourront nous battre aux échecs.', 
      skillIds: [skills[1].id] 
    });
  }

  // 5. Création d'amitiés
  if (marie && me) {
    // Vérifier si la demande existe déjà pour éviter l'erreur
    try {
        await socialService.sendFriendRequest(marie.id, me.id);
        console.log(`💌 Demande d'ami : Marie -> Moi`);
    } catch (e) {}
  }

  if (albert && me) {
    try {
        // Attention : Logique simplifiée pour le seed. 
        // Si la requête échoue (déjà amis), on ignore.
        const req = await socialService.sendFriendRequest(albert.id, me.id);
        await socialService.acceptFriendRequest(me.id, req.id);
        console.log(`🤝 Amitié : Albert <-> Moi`);
        await socialService.sendMessage(albert.id, { receiverId: me.id, content: 'Salut collègue ! Tu avances sur ton projet ?' });
    } catch (e) {}
  }

  console.log('🎉 SEEDING TERMINÉ !');
  await app.close();
}
bootstrap();