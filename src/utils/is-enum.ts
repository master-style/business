import { InputCustomValidate } from '../interfaces/input-custom-validate';

export function IsEnum(enumObj): InputCustomValidate {
    const values = Object
        .keys(enumObj)
        .map(key => enumObj[key]);

    return {
        message: `$field must be in [` + values.join(', ') + `]`,
        validate: (value) => {
            return typeof value === 'boolean';
        }
    };
}
