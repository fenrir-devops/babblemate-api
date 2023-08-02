import { IsNotEmpty } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class MakeMessageDTO {
    @IsNotEmpty()
    @ApiProperty()
    readonly content : string;
}