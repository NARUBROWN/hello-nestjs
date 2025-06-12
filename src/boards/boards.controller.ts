import { Body, Controller, Delete, Get, Logger, Param, ParseIntPipe, Patch, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { BoardStatus } from './boards-status.enum';
import { CreateBoardDto } from './dto/create-board.dto';
import { BaordStatusValidationPipe } from './pipes/boards-status-validation.pipe';
import { Board } from './board.entity';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user-decorator';
import { User } from 'src/auth/user.entity';

@Controller('boards')
@UseGuards(AuthGuard())
export class BoardsController {
    private logger = new Logger('BoardsController');
    constructor(private readonly boardService: BoardsService) {}


    // @Get()
    // getAllTask(): Board[] {
    //     return this.boardService.getAllBoards();
    // }

    // @Post()
    // /* Handler level Pipe 
    //     ValidationPipe는 nestJS가 제공하는 여러가지 구현체 중 하나
    // */
    // @UsePipes(ValidationPipe)
    // createBoard(@Body() createBoardDto: CreateBoardDto ): Board {
    //     return this.boardService.createBoard(createBoardDto);
    // }

    // @Get('/:id')
    // getBoardById(@Param('id') id: string): Board {
    //     return this.boardService.getBoardById(id);
    // }

    // @Patch('/:id/status')
    // /* Parameter level pipe */
    // updateBoardStatus(
    //     @Param('id') id: string,
    //     @Body('status', BaordStatusValidationPipe) status: BoardStatus
    // ): Board {
    //   return this.boardService.updateBoardStatus(id, status);  
    // }


    @Get('/:id')
    getBoardById(@Param('id') id: number): Promise<Board> {
        return this.boardService.getBoardById(id);
    }

    @Post()
    @UsePipes(ValidationPipe)
    crateBoard(
        @Body() crateBoardDto: CreateBoardDto,
        @GetUser() user:User
    ): Promise<Board> {
        this.logger.verbose(`User ${user.username} creating a new board. Payload.
            Payload: ${JSON.stringify(crateBoardDto)}`)
        return this.boardService.createBoard(crateBoardDto, user);
    }

    @Delete('/:id')
    deleteBoard(
        @Param('id', ParseIntPipe) id: number,
        @GetUser() user: User): Promise<void> {
        return this.boardService.deleteBoard(id, user);
    }

    @Patch('/:id/status')
    updateBoardStatus(
        @Param('id', ParseIntPipe) id: number,
        @Body('status', BaordStatusValidationPipe) status: BoardStatus
    ): Promise<Board> {
        return this.boardService.updateBoardStatus(id, status);
    }

    @Get()
    getAllBoards(
        @GetUser() user: User
    ): Promise<Board[]> {
        this.logger.verbose(`User ${user.username} trying to get all boards`);
        return this.boardService.getAllBoards(user);
    }
}
