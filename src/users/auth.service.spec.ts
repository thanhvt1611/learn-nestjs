import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';

describe('AuthService', () => {
    let service: AuthService;
    let fakeUserService: Partial<UsersService>;

    beforeEach(async () => {
        const users: User[] = [];
        fakeUserService = {
            find: (email: string) => {
                const filteredUsers = users.filter(user => user.email === email)
                return Promise.resolve(filteredUsers);
            },
            createUser: (email: string, password: string) => {
                const user = {
                    id: Math.floor(Math.random() * 999999),
                    email, 
                    password,
                } as User;
                users.push(user);
                return Promise.resolve(user);
            },
        }
        const module = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: UsersService,
                    useValue: fakeUserService,
                }
            ],
        }).compile();
    
        service = module.get(AuthService);
    })

    it('can create an instance of auth service', () => {
        expect(service).toBeDefined();
    });

    it('creates a new user with a salted & hashed password', async () => {
        const user = await service.signUp('thanhvt@gmail.com', '123456');
        expect(user.password).not.toEqual('123456');
        const [salt, hash] = user.password.split('.');
        expect(salt).toBeDefined();
        expect(hash).toBeDefined();
    });

    it('throws an error if user signs up with email that is in use', async () =>{
        await service.signUp('asdasdasdw@gmail.com', 'password');
        const user = await service.signIn('asdasdasdw@gmail.com', 'password');
        expect(user).toBeDefined();
    });

    it('throws an error if user sign in with an unused email', async () => {
        await expect(service.signIn('thanhvt@gmail.com', '123456')).rejects.toThrow(NotFoundException);
    });

    it('Throws if an invalid password is provided', async () => {
        await service.signUp('asdasdasdw@gmail.com', 'password');
        const user = await service.signIn('asdasdasdw@gmail.com', 'password');
        expect(user).toBeDefined();
    });
});

