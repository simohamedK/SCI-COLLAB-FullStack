import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SendMessageDto } from './dto/social.dto';
import { SocialService } from './social.service';

@Controller('social')
@UseGuards(AuthGuard('jwt'))
export class SocialController {
  constructor(private readonly socialService: SocialService) {}

  // --- AMIS ---

  @Post('request/:receiverId')
  sendRequest(@Request() req, @Param('receiverId', ParseIntPipe) receiverId: number) {
    return this.socialService.sendFriendRequest(req.user.id, receiverId);
  }

  @Get('requests/pending')
  getPendingRequests(@Request() req) {
    return this.socialService.getPendingRequests(req.user.id);
  }

  @Get('friends')
  getFriends(@Request() req) {
    return this.socialService.getFriends(req.user.id);
  }

  @Patch('request/:requestId/accept')
  acceptRequest(@Request() req, @Param('requestId', ParseIntPipe) requestId: number) {
    return this.socialService.acceptFriendRequest(req.user.id, requestId);
  }

  @Delete('request/:requestId/reject')
  rejectRequest(@Request() req, @Param('requestId', ParseIntPipe) requestId: number) {
      return this.socialService.rejectFriendRequest(req.user.id, requestId);
  }

  // --- CHAT ---

  @Post('messages')
  sendMessage(@Request() req, @Body() dto: SendMessageDto) {
    return this.socialService.sendMessage(req.user.id, dto);
  }

  @Get('messages/:otherUserId')
  getConversation(@Request() req, @Param('otherUserId', ParseIntPipe) otherUserId: number) {
    return this.socialService.getConversation(req.user.id, otherUserId);
  }

  // GET /social/requests/sent -> Voir mes envois
  @Get('requests/sent')
  getSentRequests(@Request() req) {
    return this.socialService.getSentRequests(req.user.id);
  }

  // DELETE /social/requests/:id -> Annuler une demande
  @Delete('requests/:id')
  cancelRequest(@Request() req, @Param('id') id: string) {
    return this.socialService.cancelRequest(+id, req.user.id);
  }

  // DELETE /social/friends/:id -> Supprimer un ami (par son User ID)
  @Delete('friends/:friendId')
  removeFriend(@Request() req, @Param('friendId') friendId: string) {
    return this.socialService.removeFriend(req.user.id, +friendId);
  }
}