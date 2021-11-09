import { IsEmail, IsNotEmpty } from 'class-validator';

export interface IUserDto {
  username: string;
  password: string;
  email: string;
  isAdmin?: boolean;
}

export class UserDTO implements IUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  username: string;

  isAdmin? = false;
}
