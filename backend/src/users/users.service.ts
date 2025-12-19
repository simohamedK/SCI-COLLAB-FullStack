import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Not, Repository } from 'typeorm';
import { Skill } from '../skills/entities/skill.entity';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(Skill) private skillsRepository: Repository<Skill>,
  ) {}

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['skills'], // On charge aussi les compétences
    });
    
    if (!user) {
      throw new NotFoundException(`Utilisateur #${id} non trouvé`);
    }
    
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ 
      where: { email }, 
      relations: ['skills'] 
    });
  }

  async update(id: number, data: any): Promise<User> {
    await this.usersRepository.update(id, data);
    return this.findOne(id);
  }

  async addSkill(userId: number, skillId: number): Promise<User> {
    const user = await this.findOne(userId);
    const skill = await this.skillsRepository.findOneBy({ id: skillId });
    
    if (!skill) throw new NotFoundException('Compétence non trouvée');

    // Vérifie si le skill n'est pas déjà présent pour éviter les doublons
    if (!user.skills.some(s => s.id === skill.id)) {
      user.skills.push(skill);
      return this.usersRepository.save(user);
    }
    return user;
  }

  async removeSkill(userId: number, skillId: number): Promise<User> {
    const user = await this.findOne(userId);
    user.skills = user.skills.filter(s => s.id !== skillId);
    return this.usersRepository.save(user);
  }

  async search(query: string, currentUserId: number): Promise<User[]> {
    if (!query) return [];
    
    return this.usersRepository.find({
      where: [
        // Cherche dans le nom OU l'institution, et exclut soi-même (Not currentUserId)
        { fullName: ILike(`%${query}%`), id: Not(currentUserId) },
        { institution: ILike(`%${query}%`), id: Not(currentUserId) }
      ],
      select: ['id', 'fullName', 'institution', 'statut'] // On ne renvoie pas tout (sécurité)
    });
  }
}