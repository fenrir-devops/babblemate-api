import { IsNotEmpty } from "class-validator";

export class CreateBabbleDto {
    @IsNotEmpty()
    readonly personality : string;
}