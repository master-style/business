import { InputCustomValidate } from '../interfaces/input-custom-validate';

export function IsBoolean(): InputCustomValidate {
    return {
        message: '$field must be boolean',
        validate: (value) => {
            return typeof value === 'boolean';
        }
    };
}