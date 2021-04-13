import { InputCustomValidate } from '../interfaces/input-custom-validate';

export function IsIn(array: (string | number)[]): InputCustomValidate {
    return {
        message: `$field must be [${array.join(', ')}]`,
        validate: (value) => {
            return array.includes(value);
        }
    };
}