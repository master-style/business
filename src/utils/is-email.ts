import { InputCustomValidate } from '../interfaces/input-custom-validate';
import isEmailValidator from 'validator/lib/isEmail';
import ValidatorJS from 'validator';

export function IsEmail(options?: ValidatorJS.IsEmailOptions, each?: boolean): InputCustomValidate {
    return {
        message: '$field must be an email' + (each ? ' array' : ''),
        validate: (value) => {
            return each
                ? value.every(eachValue => isEmailValidator(eachValue, options))
                : isEmailValidator(value, options);
        }
    };
}
