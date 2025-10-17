import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'DateOrderValidator', async: false })
export class DateOrderValidator implements ValidatorConstraintInterface {
  validate(endDate: Date, args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints;
    const startDate = (args.object as any)[relatedPropertyName];
    if (!startDate || !endDate) return true; // deja pasar si alguna fecha no está definida
    return endDate > startDate;
  }

  defaultMessage(args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints;
    return `${args.property} debe ser mayor que ${relatedPropertyName}`;
  }
}
