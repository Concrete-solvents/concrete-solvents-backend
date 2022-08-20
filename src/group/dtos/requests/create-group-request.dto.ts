import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

class CreateGroupRequestDto {
  @IsString()
  @MinLength(3)
  @MaxLength(64)
  name: string;

  @IsOptional()
  @MaxLength(1024)
  description: string;
}

export { CreateGroupRequestDto };
