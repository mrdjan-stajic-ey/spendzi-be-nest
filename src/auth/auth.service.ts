import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async userAuth(username: string, pass: string): Promise<any> {
    const user = await this.userService.findOne(username);
    if (user && user.passsword === pass) {
      const { passsword, ...result } = user;
      return result;
    }
    return null;
  }
}
