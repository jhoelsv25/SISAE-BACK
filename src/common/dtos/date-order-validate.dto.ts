import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'DateOrderValidator', async: false })
export class DateOrderValidator implements ValidatorConstraintInterface {
  validate(endDate: string | Date, args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints;
    const startDate = (args.object as Record<string, unknown>)[relatedPropertyName] as string | Date | undefined;
    if (startDate == null || endDate == null) return true;
    const end = typeof endDate === 'string' ? new Date(endDate).getTime() : endDate.getTime();
    const start = typeof startDate === 'string' ? new Date(startDate).getTime() : startDate.getTime();
    return end > start;
  }

  defaultMessage(args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints;
    return `${args.property} debe ser mayor que ${relatedPropertyName}`;
  }
}
