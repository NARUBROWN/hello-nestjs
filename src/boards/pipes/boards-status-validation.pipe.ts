import { ArgumentMetadata, BadRequestException, PipeTransform } from "@nestjs/common";
import { BoardStatus } from "../boards.model";
export class BaordStatusValidationPipe implements PipeTransform {

    readonly StatusOptions = [
        BoardStatus.PRIVATE,
        BoardStatus.PUBLIC
    ]
    transform(value: any, metadata: ArgumentMetadata) {
        value = value.toUpperCase();
        
        if (!this.isStatusValid(value)) {
            throw new BadRequestException(`${value} isn't in the staus options`);
        }
        return value;
    }

    private isStatusValid(stauts: any) {
        const index = this.StatusOptions.indexOf(stauts);
        return index !== -1;
    }
}