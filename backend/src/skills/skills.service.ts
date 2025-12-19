import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSkillDto } from './dto/create-skill.dto';
import { Skill } from './entities/skill.entity';

@Injectable()
export class SkillsService {
  constructor(
    @InjectRepository(Skill)
    private skillsRepository: Repository<Skill>,
  ) {}

  async create(createSkillDto: CreateSkillDto): Promise<Skill> {
    const existing = await this.skillsRepository.findOne({ where: { label: createSkillDto.label } });
    if (existing) {
        throw new ConflictException('Skill already exists');
    }
    const skill = this.skillsRepository.create(createSkillDto);
    return this.skillsRepository.save(skill);
  }

  async findAll(): Promise<Skill[]> {
    return this.skillsRepository.find();
  }

  async findOne(id: number): Promise<Skill> {
    const skill = await this.skillsRepository.findOneBy({ id });
    if (!skill) {
      throw new NotFoundException('Skill not found');
    }
    return skill;
  }
}