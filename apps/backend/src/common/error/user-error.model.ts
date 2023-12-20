import { Field, InterfaceType } from '@nestjs/graphql';

@InterfaceType()
export abstract class UserError {
  constructor(code: string, message: string) {
    this.code = code;
    this.message = message;
  }

  @Field()
  code: string;

  @Field()
  message: string;
}
