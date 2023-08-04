import { IsNotEmpty } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class MakeTrialMessageDTO {
    @IsNotEmpty()
    @ApiProperty()
    readonly content : string;
}