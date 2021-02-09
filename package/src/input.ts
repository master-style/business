import { ClassType } from './interfaces/class-type';
import { definePropertyMetadata } from './utils/property';

export function Input<T = any>(
    options?: {
        disabled?: boolean,
        required?: boolean,
        arrayType?: any;
        enum?: Record<string, any>;
    }
) {
    return (target: any, propertyName: string): void => {
        definePropertyMetadata(target, propertyName, Object.assign(options || {}, { key: 'input' }));
    };
}