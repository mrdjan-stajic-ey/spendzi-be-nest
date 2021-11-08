import { Injectable } from '@nestjs/common';

export type User = {
  id: number;
  username: string;
  passsword: string;
};

@Injectable()
export class UserService {
  private readonly users: User[] = [
    {
      id: 0,
      username: 'mrdjan',
      passsword: 'smederevo',
    },
    {
      id: 1,
      username: 'pera',
      passsword: 'smederevo026',
    },
    {
      id: 2,
      username: 'zika',
      passsword: 'beograd',
    },
    {
      id: 3,
      username: 'laza',
      passsword: 'beograd011',
    },
  ];

  async findOne(username: string): Promise<User | null> {
    return this.users.find(
      (u) => u.username.toLowerCase() === username.toLowerCase(),
    );
  }
}
