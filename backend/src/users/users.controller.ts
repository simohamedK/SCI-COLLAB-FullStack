import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(AuthGuard('jwt')) // Tout le controller est protégé
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  getProfile(@Request() req) {
    return this.usersService.findOne(req.user.id);
  }

  @Put('profile')
    updateProfile(@Request() req, @Body() data: UpdateUserDto) {
    return this.usersService.update(req.user.id, data);
  }

  @Post('skills/:skillId')
  addSkill(@Request() req, @Param('skillId', ParseIntPipe) skillId: number) {
    return this.usersService.addSkill(req.user.id, skillId);
  }

  @Delete('skills/:skillId')
  removeSkill(@Request() req, @Param('skillId', ParseIntPipe) skillId: number) {
    return this.usersService.removeSkill(req.user.id, skillId);
  }

  @Get('search')
  searchUsers(@Request() req, @Query('q') query: string) {
    return this.usersService.search(query, req.user.id);
  }
}