import { Injectable } from '@nestjs/common';
import { Board, BoardStatus } from './boards.model';
import { v1 as uuid } from 'uuid';
import { CreateBoardDto } from './dto/create-board.dto';
import { NotFoundException } from '@nestjs/common';
@Injectable()
export class BoardsService {
    private boards: Board[] = [];

    getAllBoards(): Board[] {
        return this.boards;
    }

    createBoard(createBoardDto: CreateBoardDto): Board {
        const { title, description } = createBoardDto;
        
        const board: Board = {
            id: uuid(),
            title,
            description,
            status: BoardStatus.PUBLIC
        };

        this.boards.push(board);
        return board;
    }

    getBoardById(id: string): Board {
        const board =  this.boards.find((board) => board.id === id);
        if (!board) {
        throw new NotFoundException(`Board with ID "${id}" not found`);
    }
    return board;
    }

    deleteBoard(id: string): void {
        const found  = this.getBoardById(id);
        this.boards = this.boards.filter((board) => board.id !== found.id);
    }

    updateBoardStatus(id: string, status: BoardStatus): Board {
        const board = this.getBoardById(id);
        board.status = status;
        return board;
    }
}
