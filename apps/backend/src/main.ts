import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { initializeTransactionalContext } from 'typeorm-transactional';
import { applyBootstrapConfig } from 'src/app.config';

const bootstrap = async (): Promise<void> => {
  initializeTransactionalContext();

  const app = await NestFactory.create(AppModule);

  applyBootstrapConfig(app);

  await app.listen(process.env.PORT || 3000);
};

bootstrap();
