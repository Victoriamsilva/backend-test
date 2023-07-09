import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OpportunitiesModule } from './opportunities/opportunities.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [OpportunitiesModule, MongooseModule.forRoot(process.env.DB_URL)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
