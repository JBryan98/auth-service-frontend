import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'boolean',
})
export class BooleanPipe implements PipeTransform {
  transform(
    value: boolean | null | undefined,
    trueLabel = 'Si',
    falseLabel = 'No',
    allowNull = false,
  ): unknown {
    if (value === null || value === undefined) {
      return allowNull ? null : falseLabel;
    }
    return value ? trueLabel : falseLabel;
  }
}
