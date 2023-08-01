import { IsNotEmpty } from "class-validator";

export class MakeMessageDTO {
    @IsNotEmpty()
    readonly content : string;
}