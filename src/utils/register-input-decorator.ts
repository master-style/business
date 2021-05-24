import { definePropertyMetadata } from '../utils/property';
import { InputDefaultOptions }  from '../interfaces/input-default-options';
import { InputCustomOptions } from '../interfaces/input-custom-options'
import { InputCustomValidate } from '../interfaces/input-custom-validate';

export function registerInputDecorator(
    target: Object,
    propertyName: string,
    type: Function,
    required: boolean,
    optionOrValidate?: InputDefaultOptions | InputCustomValidate,
    ...params: Array<InputCustomValidate | InputCustomOptions>
) {
    const options = [];

    if (optionOrValidate) {
        options.push(optionOrValidate);
    }

    options.push(...params);

    definePropertyMetadata(target, propertyName, { key: 'input', options, required }, { type });
}
