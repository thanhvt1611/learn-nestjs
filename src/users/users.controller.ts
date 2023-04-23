import { 
    Body, 
    Controller, 
    Post, 
    Get, 
    Param, 
    Query,
    Delete,
    Patch,
    NotFoundException,
    Session,
    UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { UserDto } from "./dtos/user.dto";
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from './entities/user.entity';
import { AuthGuard } from '../guards/auth.guard';

@Controller('auth')
@Serialize(UserDto)
export class UsersController {
    constructor(
        private userService: UsersService,
        private authService: AuthService,
        ) {}

    @Post('/signup')
    createUser(@Body() body: CreateUserDto) {
        const {email, password} = body;
        return this.authService.signUp(email, password);
    }

    @Post('/signin')
    async signIn(@Body() body: CreateUserDto, @Session() session: any) {
        const {email, password} = body;
        const user = await this.authService.signIn(email, password);
        session.userId = user.id;
        return user;
    }

    @Post('/signout')
    async signOut(@Session() session: any) {
        session.userId = null;
        return;
    }

    // @Get('/whoami')
    // whoAmI(@Session() session: any) {
    //     return this.userService.findOne(session.userId)
    // }
    @Get('/whoami')
    @UseGuards(AuthGuard)
    whoAmI(@CurrentUser() user: User) {
        return user;
    }

    @Get('/:id')
    async findUser(@Param('id') id: string) {
        const user = await this.userService.findOne(parseInt(id));
        if(!user) throw new NotFoundException('User not found');
        return user;
    }

    @Get()
    async findAllUsers(@Query('email') email: string) {
        return this.userService.find(email);
    }

    @Delete('/:id')
    removeUser(@Param('id') id: string) {
        return this.userService.remove(parseInt(id));
    }

    @Patch('/:id')
    updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
        return this.userService.update(parseInt(id), body);
    }
}
