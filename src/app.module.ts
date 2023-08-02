import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BabblesModule } from './babbles/babbles.module';
import { UsersModule } from './users/users.module';
import { AuthMiddleware } from './common/auth.middleware';
import { BabblesController } from './babbles/babbles.controller';
import { JwtService } from '@nestjs/jwt';


@Module({
  imports: [
    MongooseModule.forRoot(
      '',
    ),
    BabblesModule,
    UsersModule,
  ],
  providers : [JwtService]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
      consumer.apply(AuthMiddleware).forRoutes(BabblesController);
  }

}
