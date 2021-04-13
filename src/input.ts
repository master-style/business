import { definePropertyMetadata } from './utils/property';
import { InputDefaultOptions } from './interfaces/input-default-options';
import { InputCustomValidate } from './interfaces/input-custom-validate';
import { InputCustomOptions } from './interfaces/input-custom-options';

function handleDecorator(optionOrValidate: InputDefaultOptions | InputCustomValidate, required: boolean, ...params: Array<InputCustomValidate | InputCustomOptions>) {
    const options = [];

    if (optionOrValidate) {
        options.push(optionOrValidate);
    }

    options.push(...params);

    return (target: any, propertyName: string): void => {
        definePropertyMetadata(target, propertyName, { key: 'input', options, required });
    };
}

export function Required(optionOrValidate?: InputDefaultOptions | InputCustomValidate, ...params: Array<InputCustomValidate | InputCustomOptions>) {
    return handleDecorator(optionOrValidate, true, ...params);
}

export function Optional(optionOrValidate?: InputDefaultOptions | InputCustomValidate, ...params: Array<InputCustomValidate | InputCustomOptions>) {
    return handleDecorator(optionOrValidate, false, ...params);
}
