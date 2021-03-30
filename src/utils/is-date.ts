import { InputCustomValidate } from '../interfaces/input-custom-validate';

export function IsDate(): InputCustomValidate {
    return {
        message: '$field must be date',
        validate: (value) => {
            return value instanceof Date;
        }
    };
}