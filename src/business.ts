import { getPropertyMetadata } from './utils/property';
import { BusinessModel } from './business-model';
import { InputDefaultOptions } from './interfaces/input-default-options';
import { OutputDefaultOptions } from './interfaces/output-default-options';
import * as dayjs from 'dayjs';

export function Business() {
    return constructor =>
        class extends constructor {
            constructor(data?: Record<string, any>) {
                super();
    
                if (data) {
                    const inputMetadata = getPropertyMetadata(this.constructor, 'input').filter(eachMetadata => !eachMetadata.disabled);
                    for (const eachInputMetadata of inputMetadata) {
                        let firstOptions = eachInputMetadata.options[0];
                        let defaultOptions: InputDefaultOptions;
                        if (firstOptions && !('validate' in firstOptions)) {
                            if (firstOptions.disabled)
                                continue;

                            defaultOptions = firstOptions;
                        }

                        const name = defaultOptions?.sourceName ?? eachInputMetadata.name;
                        const value = data[name];

                        const type = defaultOptions?.arrayType ?? eachInputMetadata.type;

                        if (type.prototype instanceof BusinessModel && value !== undefined && value !== null) {
                            if (eachInputMetadata.type === Array) {
                                if (Array.isArray(value)) {
                                    this[eachInputMetadata.name] = value.map(eachValue => new type(eachValue));
                                } else {
                                    this[eachInputMetadata.name] = new type(value);
                                }
                            } else {
                                this[eachInputMetadata.name] = new type(value);
                            }
                        } else if (name in data) {
                            if (type === Date && defaultOptions?.dateFormat) {
                                const newDayjs = dayjs(value, defaultOptions.dateFormat);
                                if (newDayjs.format(defaultOptions.dateFormat) === value) {
                                    this[eachInputMetadata.name] = newDayjs.toDate();
                                } else {
                                    this[eachInputMetadata.name] = value;
                                }
                            } else {
                                this[eachInputMetadata.name] = value;
                            }
                        }
                    }
                }
            }

            toJSON(): Record<string, any> {
                const newObj: Record<string, any> = {};
        
                const outputMetadata = getPropertyMetadata(this.constructor, 'output');
                for (const eachOutputMetadata of outputMetadata) {
                    let firstOptions = eachOutputMetadata.options[0];
                    let defaultOptions: OutputDefaultOptions;
                    if (firstOptions && !('transform' in firstOptions)) {
                        if (firstOptions.disabled)
                            continue;

                        defaultOptions = firstOptions;
                    }

                    let value = this[eachOutputMetadata.name];
                    for (let i = (defaultOptions ? 1 : 0); i < eachOutputMetadata.options.length; i++) {
                        const eachOptions = eachOutputMetadata.options[i];
                        if (eachOptions) {
                            value = eachOptions.transform(value, this);
                        }
                    }
                    value = value ?? null;

                    if (value !== defaultOptions?.ignore) {
                        newObj[eachOutputMetadata.name] = value;
                    }
                }
        
                return newObj;
            }
        } as any;
}