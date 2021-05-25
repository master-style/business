import { InputCustomValidate } from '../interfaces/input-custom-validate';
import isMobilePhoneValidator from 'validator/lib/isMobilePhone';
import ValidatorJS from 'validator';

export function IsMobilePhone(options?: ValidatorJS.IsMobilePhoneOptions, locale?: ValidatorJS.MobilePhoneLocale, each?: boolean): InputCustomValidate {
    return {
        message: '$field must be a mobile phone' + (each ? ' array' : ''),
        validate: (value) => {
            return each
                ? value.every(eachValue => isMobilePhoneValidator(eachValue, locale, options))
                : isMobilePhoneValidator(value, locale, options);
        }
    };
}
