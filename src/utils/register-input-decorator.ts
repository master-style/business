import { definePropertyMetadata } from '../utils/property';
import { ClassType } from '../interfaces/class-type';
import { InputDefaultOptions }  from '../interfaces/input-default-options';
import { InputCustomOptions } from '../interfaces/input-custom-options'
import { InputCustomValidate } from '../interfaces/input-custom-validate';

export function registerInputDecorator<T>(
    target: ClassType<T>,
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
