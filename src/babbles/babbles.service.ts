import { Injectable } from '@nestjs/common';
import { CreateBabbleDto } from './dto/create-babble.dto';
import { Babble } from './interfaces/babble.interface';


@Injectable()
export class BabblesService {
    async create(id : string, createBabbleDto : CreateBabbleDto) : Promise<Babble>{
        console.log(id, createBabbleDto);
        return null;
    }
}