import { Injectable } from '@nestjs/common';
import { BoardStatus } from './boards-status.enum';
import { v1 as uuid } from 'uuid';
import { CreateBoardDto } from './dto/create-board.dto';
import { NotFoundException } from '@nestjs/common';
import { BoardRepository } from './board.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from './board.entity';
import { User } from 'src/auth/user.entity';
@Injectable()
export class BoardsService {
    constructor(private readonly boardRepository: BoardRepository) {}

    // private boards: Board[] = [];

    // getAllBoards(): Board[] {
    //     return this.boards;
    // }

    // createBoard(createBoardDto: CreateBoardDto): Board {
    //     const { title, description } = createBoardDto;
        
    //     const board: Board = {
    //         id: uuid(),
    //         title,
    //         description,
    //         status: BoardStatus.PUBLIC
    //     };

    //     this.boards.push(board);
    //     return board;
    // }

    // getBoardById(id: string): Board {
    //     const board =  this.boards.find((board) => board.id === id);
    //     if (!board) {
    //     throw new NotFoundException(`Board with ID "${id}" not found`);
    // }
    // return board;
    // }

    // deleteBoard(id: string): void {
    //     const found  = this.getBoardById(id);
    //     this.boards = this.boards.filter((board) => board.id !== found.id);
    // }

    // updateBoardStatus(id: string, status: BoardStatus): Board {
    //     const board = this.getBoardById(id);
    //     board.status = status;
    //     return board;
    // }

    async getBoardById(id: number): Promise<Board> {
        // TypeORM 3.0부터 문법 변경
        const found = await this.boardRepository.findOne({
            where : {id}
        });

        if (!found) {
            throw new NotFoundException(`Can't find Board with id ${id}`)
        }

        return found;
    }

    async createBoard(createBoardDto: CreateBoardDto, user: User): Promise<Board> {
        const { title, description } = createBoardDto;

        const board = this.boardRepository.create({
            title,
            description,
            status: BoardStatus.PUBLIC,
            user
        });

        await this.boardRepository.save(board);
        return board;
    }

    async deleteBoard(id: number, user: User): Promise<void> {
        const result = await this.boardRepository.delete({id, user});
        
        if(result.affected === 0) {
            throw new NotFoundException(`Can't find Board id ${id}`);
        }

        console.log('result', result);
    }

    async updateBoardStatus(id: number, status: BoardStatus): Promise<Board> {
        const board = await this.getBoardById(id);
        board.status = status;

        await this.boardRepository.save(board);
        return board;
    }

    async getAllBoards(user: User): Promise<Board[]> {
        const query = this.boardRepository.createQueryBuilder('board');
        query.where('board.userId = :userId', { userId: user.id });

        const boards = await query.getMany();

        return boards;
    }


}
