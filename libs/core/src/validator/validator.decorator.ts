import { ValidatorConstraint, ValidatorConstraintInterface, ValidatorOptions } from 'class-validator';
import { registerDecorator, ValidationOptions } from 'class-validator';

@ValidatorConstraint({ name: 'IsPhoneNumber', async: false })
export class IsPhoneNumber implements ValidatorConstraintInterface {
  validate(phoneNumber: string) {
    if (phoneNumber === undefined) return true;
    const format = /^((09|03|07|08|05)+([0-9]{8}))$/;
    return format.test(phoneNumber);
  }

  defaultMessage() {
    return 'Số điện thoại không đúng định dạng';
  }
}

@ValidatorConstraint({ name: 'IsDateString', async: false })
export class IsDateString implements ValidatorConstraintInterface {
  validate(dateString: string) {
    const format =
      /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/;
    return format.test(dateString);
  }

  defaultMessage() {
    return 'Ngày không đúng định dạng DD-MM-YYYY';
  }
}

/*eslint-disable */
export function IsOnlyDate(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsOnlyDate',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: {
        message: 'Please provide only date like 2020-12-08',
        ...validationOptions,
      },
      validator: {
        validate(value: any) {
          const regex = /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/;
          return typeof value === 'string' && regex.test(value);
        },
      },
    });
  };
}
