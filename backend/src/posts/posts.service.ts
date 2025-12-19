import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Skill } from '../skills/entities/skill.entity';
import { User } from '../users/entities/user.entity';
import { CreateCommentDto, CreatePostDto } from './dto/create-post.dto';
import { Comment } from './entities/comment.entity';
import { PostEntity } from './entities/post.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostEntity)
    private postsRepository: Repository<PostEntity>,
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
    @InjectRepository(Skill)
    private skillsRepository: Repository<Skill>,
  ) {}

  async create(user: User, createPostDto: CreatePostDto): Promise<PostEntity> {
    const { title, content, skillIds } = createPostDto;

    const newPost = this.postsRepository.create({
      title,
      content,
      author: user, // On attache l'auteur
      skills: [],   // On initialise vide
    });

    // Si on a des IDs de skills, on va chercher les objets correspondants
    if (skillIds && skillIds.length > 0) {
      const skills = await this.skillsRepository.findBy({
        id: In(skillIds),
      });
      newPost.skills = skills;
    }

    return this.postsRepository.save(newPost);
  }

  // Fil d'actualité global (Tous les posts récents)
  async findAll(): Promise<PostEntity[]> {
    return this.postsRepository.find({
      relations: ['skills', 'comments', 'comments.author'],
      order: { createdAt: 'DESC' },
    });
  }

  // Trouve les posts qui partagent au moins un skill avec l'utilisateur
  async findRecommended(user: User): Promise<PostEntity[]> {
     const userSkillIds = user.skills?.map(s => s.id) || [];

    if (userSkillIds.length === 0) {
        // Si l'user n'a pas de skills, on retourne le feed global
        return this.findAll();
    }

    // Chercher les posts qui contiennent ces skills
    return this.postsRepository.find({
        where: {
            skills: {
                id: In(userSkillIds)
            }
        },
        relations: ['skills', 'comments', 'comments.author'],
        order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<PostEntity> {
    const post = await this.postsRepository.findOne({
      where: { id },
      relations: ['skills', 'comments', 'comments.author'],
    });
    if (!post) throw new NotFoundException('Post not found');
    return post;
  }

  async addComment(user: User, postId: number, createCommentDto: CreateCommentDto): Promise<Comment> {
    const post = await this.findOne(postId);
    
    const comment = this.commentsRepository.create({
      content: createCommentDto.content,
      post: post,
      author: user,
    });

    return this.commentsRepository.save(comment);
  }

  async update(id: number, userId: number, updateData: any) {
    //On cherche le post avec son auteur
    const post = await this.postsRepository.findOne({ 
      where: { id }, 
      relations: ['author'] 
    });

    if (!post) throw new NotFoundException('Post introuvable');

    //SÉCURITÉ : On vérifie que c'est bien l'auteur
    if (post.author.id !== userId) {
      throw new ForbiddenException("Vous n'êtes pas l'auteur de ce post !");
    }

    //On met à jour (Titre et Contenu)
    post.title = updateData.title;
    post.content = updateData.content;
     
    return this.postsRepository.save(post);
  }
  
}