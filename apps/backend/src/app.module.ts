import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriverConfig, ApolloDriver } from '@nestjs/apollo';
import { ViewerModule } from 'src/viewer/viewer.module';
import { InquiryModule } from 'src/inquiry/inquiry.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import datasource from 'datasource';
import { WithdrawalModule } from 'src/withdrawal/withdrawal.module';
import { StorageModule } from 'src/storage/storage.module';
import { addTransactionalDataSource } from 'typeorm-transactional';
import { DataSource } from 'typeorm';
import { HealthModule } from 'src/common/health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    TypeOrmModule.forRootAsync({
      useFactory: () => datasource,
      dataSourceFactory: async (options) => {
        if (!options) {
          throw new Error('Invalid options passed');
        }
        return addTransactionalDataSource(new DataSource(options));
      },
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), './schema.gql'),
      sortSchema: true,
      playground: process.env.ENV !== 'prd',
    }),
    ViewerModule,
    InquiryModule,
    WithdrawalModule,
    StorageModule,
    HealthModule,
  ],
})
export class AppModule {}
