import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { registerDecorator, ValidationOptions } from 'class-validator';

// CORE

/**
 * Custom function to min length function of class-validator
 *
 * Function used to check the length is less than equal @param: max to the length of a string
 */
export function MaxLength(max: number, tag?: string, validationOptions?: ValidationOptions): PropertyDecorator {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      name: 'MaxLength',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [max],
      options: validationOptions,
      validator: {
        validate(value: string, args?: ValidationArguments): Promise<boolean> | boolean {
          if (value === undefined || typeof value === 'number') return false;
          return value.length <= args.constraints[0];
        },

        defaultMessage(args?: ValidationArguments): string {
          return tag
            ? `${tag.toUpperCase()}_${MaxLength.name.toUpperCase()}_${args.constraints[0]}`
            : `VALIDATE_${MaxLength.name.toUpperCase()}_${args.constraints[0]}`;
        },
      },
    });
  };
}
