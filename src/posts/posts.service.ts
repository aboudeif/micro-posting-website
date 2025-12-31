import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Post } from './models/post.model';
import { CreatePostDto } from './dto/create-post.dto';
import { User } from '../users/models/user.model';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post)
    private postModel: typeof Post,
  ) {}

  async create(createPostDto: CreatePostDto, userId: number): Promise<Post> {
    return this.postModel.create({ ...createPostDto, userId } as any);
  }

  async findAll(userId: number): Promise<Post[]> {
    return this.postModel.findAll({
      where: { userId },
      include: [User],
      order: [['createdAt', 'DESC']],
    });
  }

  async remove(id: number, userId: number): Promise<void> {
    const post = await this.postModel.findOne({ where: { id, userId } });
    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found or not authorized`);
    }
    await post.destroy();
  }
}
