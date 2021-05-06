import { InputCustomValidate } from '../interfaces/input-custom-validate';

export function IsEnum(enumObj, each?: boolean): InputCustomValidate {
    const values = Object
        .keys(enumObj)
        .map(key => enumObj[key]);

    return {
        message: `$field must be in [${values.join(', ')}]` + (each ? ' array' : ''),
        validate: (value) => {
            return each
                ? value.every(eachValue => values.includes(eachValue))
                : values.includes(value);
        }
    };
}
