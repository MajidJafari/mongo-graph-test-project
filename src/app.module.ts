import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StoreModule } from './store/store.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    StoreModule,
    MongooseModule.forRoot('mongodb://localhost/grocery-store'),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
