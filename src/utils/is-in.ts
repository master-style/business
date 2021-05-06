import { InputCustomValidate } from '../interfaces/input-custom-validate';

export function IsIn(values: (string | number)[], each?: boolean): InputCustomValidate {
    return {
        message: `$field must be in [${values.join(', ')}]` + (each ? ' array' : ''),
        validate: (value) => {
            return each
                ? value.every(eachValue => values.includes(eachValue))
                : values.includes(value);
        }
    };
}