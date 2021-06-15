import { InputCustomValidate } from '../interfaces/input-custom-validate';

export function isEnum(enumObj, value): boolean {
    const values = Object
        .keys(enumObj)
        .map(key => enumObj[key]);

    return values.includes(value);
}

export function IsEnum(enumObj, each?: boolean): InputCustomValidate {
    const values = Object
        .keys(enumObj)
        .map(key => enumObj[key]);

    return {
        message: `$field must be in [${values.join(', ')}]` + (each ? ' array' : ''),
        validate: (value) => {
            return each
                ? value.every(eachValue => isEnum(enumObj, eachValue))
                : isEnum(enumObj, value);
        }
    };
}
