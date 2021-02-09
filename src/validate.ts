import { getPropertyMetadata } from './utils/property';

export interface ValidationError {
    parent: any,
    field: string,
    message: string
}

export function validate(instance): ValidationError[] {
    const validateErrors = [];

    (function checkLoop(inst, propertyMetadata?, parent?) {
        const parentInst = parent ?? inst;

        const checkBasicType = (value, metadata) => {
            const arrayTips = metadata.type === Array ? ' array' : '';
            switch (metadata.enum ?? metadata.type) {
                case String:
                    if (typeof value !== 'string') {
                        validateErrors.push({
                            parent: parentInst,
                            field: metadata.name,
                            message: `${metadata.name} must be string` + arrayTips
                        });
                    }
                    break;
                case Number:
                    if (typeof value !== 'number') {
                        validateErrors.push({
                            parent: parentInst,
                            field: metadata.name,
                            message: `${metadata.name} must be number` + arrayTips
                        });
                    }
                    break;
                case Boolean:
                    if (typeof value !== 'boolean') {
                        validateErrors.push({
                            parent: parentInst,
                            field: metadata.name,
                            message: `${metadata.name} must be boolean` + arrayTips
                        });
                    }
                    break;
                case Date:
                    if (!(value instanceof Date)) {
                        validateErrors.push({
                            parent: parentInst,
                            field: metadata.name,
                            message: `${metadata.name} must be date` + arrayTips
                        });
                    }
                    break;
                case Object:
                    if (typeof value !== 'object') {
                        validateErrors.push({
                            parent: parentInst,
                            field: metadata.name,
                            message: `${metadata.name} must be object` + arrayTips
                        });
                    }
                default:
                    if (metadata.enum) {
                        const values = Object.keys(metadata.enum).map(key => metadata.enum[key]);
                        if (values.every(eachValue => eachValue !== value)) {
                            validateErrors.push({
                                parent: parentInst,
                                field: metadata.name,
                                message: `${metadata.name} must be in [` + values.join(', ') + `]` + arrayTips
                            });
                        }
                        return true;
                    }

                    return false;
            }
    
            return true;
        }

        if (propertyMetadata && checkBasicType(inst, propertyMetadata))
            return;

        const outputMetadata = getPropertyMetadata(propertyMetadata?.type ?? inst.constructor, 'input').filter(eachMetadata => !eachMetadata.disabled);

        for (const eachOutputMetadata of outputMetadata) {
            const value = inst[eachOutputMetadata.name];
            if (value === undefined || value === null) {
                if (eachOutputMetadata.required) {
                    validateErrors.push({
                        parent: parentInst,
                        field: eachOutputMetadata.name,
                        message: `${eachOutputMetadata.name} is required`
                    });
                }
            } else {
                if (eachOutputMetadata.type === Array) {
                    if (Array.isArray(value)) {
                        for (const eachValue of value) {
                            checkLoop(eachValue, eachOutputMetadata, inst);
                        }
                    } else {
                        validateErrors.push({
                            parent: parentInst,
                            field: eachOutputMetadata.name,
                            message: `${eachOutputMetadata.name} must be array`
                        });
                    }
                } else if (!checkBasicType(value, eachOutputMetadata)) {
                    checkLoop(value, eachOutputMetadata, inst);
                }
            }
        }
    })(instance);

    return validateErrors;
}