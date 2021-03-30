import { definePropertyMetadata } from './utils/property';
import { OutputDefaultOptions } from './interfaces/output-default-options';
import { OutputCustomTransform } from './interfaces/output-custom-transform';

export function Output(optionOrTransform?: OutputDefaultOptions | OutputCustomTransform, ...params: Array<OutputCustomTransform>) {
    const options = [];

    if (optionOrTransform) {
        options.push(optionOrTransform);
    }

    options.push(...params);

    return (target: any, propertyName: string): void => {
        definePropertyMetadata(target, propertyName, { key: 'output', options });
    };
}