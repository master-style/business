import { InputCustomValidate } from '../interfaces/input-custom-validate';

export function IsObject(): InputCustomValidate {
    return {
        message: '$field must be object',
        validate: (value) => {
            return typeof value === 'object';
        }
    };
}