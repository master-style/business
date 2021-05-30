import { InputCustomValidate } from '../interfaces/input-custom-validate';

export function Length(min: number, max: number): InputCustomValidate {
    return {
        message: `$field length must be at least ${min} and shorter than ${max}`,
        validate: (value) => {
            return Array.isArray(value)
                ? value.length <= max && value.length >= min
                : typeof value === 'string' 
                    ? value.length <= max && value.length >= min
                    : false;
        }
    };
}