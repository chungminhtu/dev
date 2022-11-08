import { IsString, IsNotEmpty, IsOptional, IsEmail, MinLength, MaxLength } from 'class-validator';

export class LoginGoogleDto {
  @IsOptional()
  @IsEmail()
  @MinLength(5)
  @MaxLength(50)
  email?: string;

  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsNotEmpty()
  @IsString()
  socialId: string;
}

export class LoginFireBaseAuthDto {
  @IsNotEmpty()
  @IsString()
  idToken: string;
}
