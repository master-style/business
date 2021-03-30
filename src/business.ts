import { getPropertyMetadata } from './utils/property';
import { BusinessModel } from './business-model';

export function Business() {
    return constructor =>
        class extends constructor {
            constructor(data?: Record<string, any>) {
                super();
    
                if (data) {
                    const inputMetadata = getPropertyMetadata(this.constructor, 'input').filter(eachMetadata => !eachMetadata.disabled);
                    for (const eachInputMetadata of inputMetadata) {
                        const value = data[eachInputMetadata.name];
        
                        const type = eachInputMetadata.arrayType ?? eachInputMetadata.type;

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
                        } else if (eachInputMetadata.name in data) {
                            this[eachInputMetadata.name] = value;
                        }
                    }
                }
            }

            toJSON(): Record<string, any> {
                const newObj: Record<string, any> = {};
        
                const outputMetadata = getPropertyMetadata(this.constructor, 'output');
                for (const eachOutputMetadata of outputMetadata) {
                    let firstOptions = eachOutputMetadata.options[0];
                    if (firstOptions && !('transform' in firstOptions)) {
                        if (firstOptions.disabled)
                            continue;
                    }

                    let value = this[eachOutputMetadata.name];
                    for (let i = 0; i < eachOutputMetadata.options.length; i++) {
                        const eachOptions = eachOutputMetadata.options[i];
                        if (eachOptions) {
                            value = eachOptions.transform(value);
                        }
                    }

                    newObj[eachOutputMetadata.name] = value ?? null;
                }
        
                return newObj;
            }
        } as any;
}