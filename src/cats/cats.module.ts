import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';
import { Cat } from '../domain/cats.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cat])],
  exports: [TypeOrmModule],
  controllers: [CatsController],
  providers: [CatsService]
})
export class CatsModule {}
