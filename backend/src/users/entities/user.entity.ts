import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Skill } from '../../skills/entities/skill.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ name: 'password_hash', select: false }) // Ne jamais renvoyer le mdp par défaut
  passwordHash: string;

  @Column({ name: 'full_name' })
  fullName: string;

  @Column({ nullable: true })
  institution: string;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({ default: 'researcher' })
  statut: string;

  @Column({ name: 'avatar_url', nullable: true })
  avatarUrl: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  
  // Relation N:N avec Skills (Table de liaison user_skills générée auto par TypeORM ou mappée manuellement)
  @ManyToMany(() => Skill)
  @JoinTable({
    name: 'user_skills', // Nom de la table de liaison SQL
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'skill_id', referencedColumnName: 'id' },
  })
  skills: Skill[];
}