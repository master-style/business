import { InputCustomValidate } from '../interfaces/input-custom-validate';

export function IsArray(): InputCustomValidate {
    return {
        message: '$field must be array',
        validate: (value) => {
            return Array.isArray(value);
        }
    };
}