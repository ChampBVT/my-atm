import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriverConfig, ApolloDriver } from '@nestjs/apollo';
import { ViewerModule } from 'src/viewer/viewer.module';
import { InquiryModule } from 'src/inquiry/inquiry.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import datasource from 'datasource';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    TypeOrmModule.forRoot(datasource),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), './schema.gql'),
      sortSchema: true,
      playground: process.env.ENV !== 'prd',
    }),
    ViewerModule,
    InquiryModule,
  ],
})
export class AppModule {}
