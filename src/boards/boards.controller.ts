import { Body, Controller, Get, Param, Patch, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { Board, BoardStatus } from './boards.model';
import { CreateBoardDto } from './dto/create-board.dto';
import { BaordStatusValidationPipe } from './pipes/boards-status-validation.pipe';

@Controller('boards')
export class BoardsController {
    constructor(private readonly boardService: BoardsService) {}


    @Get()
    getAllTask(): Board[] {
        return this.boardService.getAllBoards();
    }

    @Post()
    /* Handler level Pipe 
        ValidationPipe는 nestJS가 제공하는 여러가지 구현체 중 하나
    */
    @UsePipes(ValidationPipe)
    createBoard(@Body() createBoardDto: CreateBoardDto ): Board {
        return this.boardService.createBoard(createBoardDto);
    }

    @Get('/:id')
    getBoardById(@Param('id') id: string): Board {
        return this.boardService.getBoardById(id);
    }

    @Patch('/:id/status')
    /* Parameter level pipe */
    updateBoardStatus(
        @Param('id') id: string,
        @Body('status', BaordStatusValidationPipe) status: BoardStatus
    ): Board {
      return this.boardService.updateBoardStatus(id, status);  
    }

}
