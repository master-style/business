import { definePropertyMetadata } from './utils/property';

export function Output<T = any>(options?: { disabled?: boolean, ref?: (instance: T) => any }) {
    return (target: any, propertyName: string): void => {
        definePropertyMetadata(target, propertyName, Object.assign(options || {}, { key: 'output' }));
    };
}