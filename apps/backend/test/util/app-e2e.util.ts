import { INestApplication } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import { applyBootstrapConfig } from 'src/app.config';
import { AppModule } from 'src/app.module';
import { DataSource } from 'typeorm';
import { runSeeders } from 'typeorm-extension';
import { initializeTransactionalContext } from 'typeorm-transactional';

export class AppE2EUtil {
  static async getApp(): Promise<INestApplication> {
    initializeTransactionalContext();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    const app = moduleFixture.createNestApplication();

    applyBootstrapConfig(app);

    await app.init();

    const dataSource = moduleFixture.get<DataSource>(DataSource);

    await runSeeders(dataSource);

    return app;
  }
}
