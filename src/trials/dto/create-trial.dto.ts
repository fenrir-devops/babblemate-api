import { IsNotEmpty } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class CreateTrialDto {
    
    @ApiProperty()
    @IsNotEmpty()
    readonly deviceId: string;
    
    @ApiProperty()
    @IsNotEmpty()
    readonly personality : string;

}