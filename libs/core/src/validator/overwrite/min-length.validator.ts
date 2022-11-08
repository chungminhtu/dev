import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { registerDecorator, ValidationOptions } from 'class-validator';

// CORE

/**
 * Custom function to min length function of class-validator
 *
 * Function used to check the length is greater than equal @param: min to the length of a string
 */
export function MinLength(min: number, tag?: string, validationOptions?: ValidationOptions): PropertyDecorator {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      name: 'MinLength',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [min],
      options: validationOptions,
      validator: {
        validate(value: string, args?: ValidationArguments): Promise<boolean> | boolean {
          if (value === undefined || typeof value !== 'string') return false;
          return value.length >= args.constraints[0];
        },

        defaultMessage(args?: ValidationArguments): string {
          return tag
            ? `${tag.toUpperCase()}_${MinLength.name.toUpperCase()}_${args.constraints[0]}`
            : `VALIDATE_${MinLength.name.toUpperCase()}_${args.constraints[0]}`;
        },
      },
    });
  };
}
