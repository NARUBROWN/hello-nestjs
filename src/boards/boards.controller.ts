import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { BoardStatus } from './boards-status.enum';
import { CreateBoardDto } from './dto/create-board.dto';
import { BaordStatusValidationPipe } from './pipes/boards-status-validation.pipe';
import { Board } from './board.entity';

@Controller('boards')
export class BoardsController {
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
    crateBoard(@Body() crateBoardDto: CreateBoardDto): Promise<Board> {
        return this.boardService.createBoard(crateBoardDto);
    }

    @Delete('/:id')
    deleteBoard(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.boardService.deleteBoard(id);
    }

    @Patch('/:id/status')
    updateBoardStatus(
        @Param('id', ParseIntPipe) id: number,
        @Body('status', BaordStatusValidationPipe) status: BoardStatus
    ): Promise<Board> {
        return this.boardService.updateBoardStatus(id, status);
    }

    @Get()
    getAllBoards(): Promise<Board[]> {
        return this.boardService.getAllBoards();
    }
}
