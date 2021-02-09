import { definePropertyMetadata } from './utils/property';

export function Input(
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