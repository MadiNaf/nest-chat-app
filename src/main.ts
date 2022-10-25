import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as sqlite3 from 'sqlite3';
import initChatDataBase from './db/chatdb-config';

const dbname = 'src/db/chatdb.db'; 
const db = new sqlite3.Database(dbname);
const whiteList = ['http://localhost:4200'];
const origin = (origin, calbk) => {
        const originIndex = whiteList.indexOf(origin);
        if (originIndex !== -1) calbk(null, true);
        calbk(new Error('Not allowed by CORS'));
      };

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(
    // { origin: origin, methods: 'GET,PUT,POST,UPDATE,DELETE', credentials: true }
  );
  const port = process.env.PORT || 3000;
  await app.listen(port);
}
bootstrap();
initChatDataBase();

export { db };