import { InputCustomValidate } from '../interfaces/input-custom-validate';

export function IsNumber(): InputCustomValidate {
    return {
        message: '$field must be number',
        validate: (value) => {
            return typeof value === 'number';
        }
    };
}