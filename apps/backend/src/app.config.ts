import { INestApplication, ValidationPipe } from '@nestjs/common';

export const applyBootstrapConfig = (app: INestApplication): void => {
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.enableCors();
};
