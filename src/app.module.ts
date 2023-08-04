import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BabblesModule } from './babbles/babbles.module';
import { UsersModule } from './users/users.module';
import { AuthMiddleware } from './common/auth.middleware';
import { BabblesController } from './babbles/babbles.controller';
import { JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';


import { TrialsModule } from './trials/trials.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        console.log(config.get<string>('MONGO_DB_URI'));
        return ({
        
        uri: config.get<string>('MONGO_DB_URI'), // Loaded from .ENV
      })}
    }),
    BabblesModule,
    UsersModule,
    TrialsModule
  ],
  providers: [JwtService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(BabblesController);
  }
}
