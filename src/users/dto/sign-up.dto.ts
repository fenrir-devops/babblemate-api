import { IsNotEmpty, IsString, IsDateString } from "class-validator";

export class SignUpDto {
    
    @IsNotEmpty()
    readonly userId : string;
    
    @IsNotEmpty()
    readonly userPassword : string;
    
    
    @IsNotEmpty()
    readonly userEmail : string;
    

    @IsNotEmpty()
    readonly userName : string;
    
    @IsDateString()
    @IsNotEmpty()
    readonly userBirthdate : string;
}
