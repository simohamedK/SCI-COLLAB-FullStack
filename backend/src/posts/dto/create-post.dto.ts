import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true }) 
  skillIds?: number[];
}
export class CreateCommentDto {
  @IsNotEmpty()
  @IsString()
  content: string;
}