import { InputCustomValidate } from '../interfaces/input-custom-validate';

export function MinLength(length: number): InputCustomValidate {
    return {
        message: `$field length must at least ${length}`,
        validate: (value) => {
            return Array.isArray(value)
                ? value.length >= length
                : typeof value === 'string' 
                    ? value.length >= length
                    : false;
        }
    };
}