import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class User {
    @Prop({unique : true})
    userId : string;
    @Prop()
    userPassword : string;
    @Prop()
    userEmail : string;    
    @Prop()
    userName : string;
    @Prop()
    userBirthdate : Date;
}

export const UserSchema = SchemaFactory.createForClass(User);