import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { UsersController } from './users.controller';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';


describe('UsersController', () => {
  let controller: UsersController;
  let fakeUserService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUserService = {
      findOne: (id: number) => {
        return Promise.resolve(
          {
            id, 
            email: 'thaweaw@gmail.com', 
            password: '123asdas'
          } as User
        )
      },
      find: (email: string) => {
        return Promise.resolve([
          {
            id: 9999,
            email,
            password: 'aweasd@asd'
          }
        ] as User[])
      },
      // createUser: jest.fn(),
      // update: jest.fn(),
      // remove: jest.fn(),
    };

    fakeAuthService = {
      // signup: () => {},
      signIn: (email: string, password: string) => {
        return Promise.resolve({ id: 1, email, password } as User);
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        UsersController
      ],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUserService,
        },
        {
          provide: AuthService,
          useValue: fakeAuthService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  it('findAllUsers returns a list of users with the given email', async () => {
    const users = await controller.findAllUsers('asdf@asdf.com');
    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual('asdf@asdf.com');
  });

  it('findUser returns a single user with the given id', async () => {
    const user = await controller.findUser('1');
    expect(user).toBeDefined();
  });

  it('findUser throws an error if user with given id is not found', async () => {
    fakeUserService.findOne = () => null;
    await expect(controller.findUser('1')).rejects.toThrow(NotFoundException);
  });

  it('signin updates session object and returns user', async () => {
    const session = { userId: -10 };
    const user = await controller.signIn(
      { email: 'vtthanh@gmail.com', password: '123456' },
      session,
    );

    expect(user.id).toEqual(1);
    expect(session.userId).toEqual(1);
  });
});
