import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsNotEmpty(tag?: string, validationOptions?: ValidationOptions): PropertyDecorator {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      name: 'IsNotEmpty',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any, args?: ValidationArguments): Promise<boolean> | boolean {
          return value !== undefined && value !== '' && value !== null;
        },

        defaultMessage(args?: ValidationArguments): string {
          return tag
            ? `${tag.toUpperCase()}_${IsNotEmpty.name.toUpperCase()}`
            : `VALIDATE_${IsNotEmpty.name.toUpperCase()}`;
        },
      },
    });
  };
}
