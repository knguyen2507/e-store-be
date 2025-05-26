import { IQueryResult } from '@nestjs/cqrs';
import { Expose } from 'class-transformer';

export class FindProductByCodeResult implements IQueryResult {
  @Expose()
  readonly id: string;
  @Expose()
  readonly code: string;
  @Expose()
  readonly name: string;
}
