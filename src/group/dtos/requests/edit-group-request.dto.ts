import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

class EditGroupRequestDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(64)
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  avatarUrl?: string;
}

export { EditGroupRequestDto };
