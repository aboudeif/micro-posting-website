import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { Post } from './models/post.model';

@Module({
  imports: [SequelizeModule.forFeature([Post]),],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
