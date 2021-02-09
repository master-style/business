import { ClassType } from '../interfaces/class-type';
import 'reflect-metadata';

export function definePropertyMetadata<T>(
    target: ClassType<T>,
    propName: string,
    columnPropOptions: { key: string, [ortherKey: string]: any }
): void {
    const type = Reflect.getMetadata('design:type', target, propName);
    const newProperty = Object.assign(
        columnPropOptions,
        {
            name: propName,
            type
        }
    );
    const metaData = Reflect.getOwnMetadata(columnPropOptions.key, target);
    !metaData
        ? Reflect.defineMetadata(
            columnPropOptions.key,
            [newProperty],
            target
        )
        : metaData.push(newProperty);
};

export function getPropertyMetadata<T>(cls: ClassType<T> | Function, type?: string): any[] {
    const metadata = [];

    let target = cls.prototype;
    while (target !== Object.prototype) {
        const childFields = (Reflect.getOwnMetadata(type, target) || [])
            .filter(eachChildField => metadata.every(eachMetadata => eachMetadata.name !== eachChildField.name));

        metadata.push(...childFields);

        target = Object.getPrototypeOf(target);
    }

    return metadata;
};