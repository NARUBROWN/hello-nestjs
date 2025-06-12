import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserRepository } from "./user.repository";
import { User } from "./user.entity";
import * as config from 'config';

@Injectable()
export class JwtStategy extends PassportStrategy(Strategy) {
   
    constructor(private readonly userRepository: UserRepository) {
        super({
            secretOrKey: process.env.JWT_SECRET || config.get('jwt.secret'),
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
        });
    }

    async validate(payload) {
        const { username } = payload;
        const user = await this.userRepository.findOne({
            where: {
                username
            }
        });

        if (!user) {
            throw new UnauthorizedException();
        }

        return user;
    }
}