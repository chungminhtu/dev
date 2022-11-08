import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { registerDecorator, ValidationOptions } from 'class-validator';
import { PASSWORD_MESSAGE, PASSWORD_REGEX } from '@core/validator/regex';

export function IsPassword(level?: string, validationOptions?: ValidationOptions): PropertyDecorator {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      name: 'IsPassword',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any, args?: ValidationArguments): Promise<boolean> | boolean {
          if (!level) return false;
          const levelRegex: RegExp = PASSWORD_REGEX[level];
          return levelRegex.test(value);
        },

        defaultMessage(args?: ValidationArguments): string {
          return level ? PASSWORD_MESSAGE[level] : 'Mật khẩu chưa đủ mạnh';
        },
      },
    });
  };
}
