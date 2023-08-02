import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
export class SignInDto {
    @ApiProperty()
    @IsNotEmpty()
    readonly userId : string;
    @ApiProperty()
    @IsNotEmpty()
    readonly userPassword : string;
}