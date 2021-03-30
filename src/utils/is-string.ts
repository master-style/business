import { InputCustomValidate } from '../interfaces/input-custom-validate';

export function IsString(): InputCustomValidate {
    return {
        message: '$field must be string',
        validate: (value) => {
            return typeof value === 'string';
        }
    };
}