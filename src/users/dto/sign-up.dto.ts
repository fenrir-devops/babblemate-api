import { IsNotEmpty, IsDateString } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class SignUpDto {
    @ApiProperty()
    @IsNotEmpty()
    readonly userId : string;
    
    @ApiProperty()
    @IsNotEmpty()
    readonly userPassword : string;
    
    @ApiProperty()
    @IsNotEmpty()
    readonly userEmail : string;
    
    @ApiProperty()
    @IsNotEmpty()
    readonly userName : string;
    
    @ApiProperty()
    @IsDateString()
    @IsNotEmpty()
    readonly userBirthdate : string;
}
