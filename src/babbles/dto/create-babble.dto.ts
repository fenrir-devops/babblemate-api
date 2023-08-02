import { IsNotEmpty } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class CreateBabbleDto {
    @ApiProperty()
    @IsNotEmpty()
    readonly personality : string;
}