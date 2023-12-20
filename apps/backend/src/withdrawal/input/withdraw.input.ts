import { ArgsType, Field } from '@nestjs/graphql';
import {
  IsNumberString,
  IsPositive,
  MaxLength,
  MinLength,
} from 'class-validator';

@ArgsType()
export class WithdrawInput {
  @Field(() => String)
  @IsNumberString({ no_symbols: true })
  @MaxLength(4)
  @MinLength(4)
  pin: string;

  @Field(() => Number)
  @IsPositive()
  amount: number;
}
