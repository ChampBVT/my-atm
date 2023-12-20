import { ArgsType, Field } from '@nestjs/graphql';
import { IsNumberString, MaxLength, MinLength } from 'class-validator';

@ArgsType()
export class InquiryAccountInput {
  @Field(() => String)
  @IsNumberString({ no_symbols: true })
  @MaxLength(4)
  @MinLength(4)
  pin: string;
}
