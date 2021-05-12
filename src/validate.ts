import { getPropertyMetadata } from './utils/property';
import { IsArray } from './utils/is-array';
import { IsString } from './utils/is-string';
import { IsNumber } from './utils/is-number';
import { IsBoolean } from './utils/is-boolean';
import { IsObject } from './utils/is-object';
import { IsDate } from './utils/is-date';
import { IsEnum } from './utils/is-enum';
import { InputCustomValidate } from './interfaces/input-custom-validate';
import { InputCustomOptions } from './interfaces/input-custom-options';
import { InputDefaultOptions } from './interfaces/input-default-options';

export interface ValidationError {
    parent: any,
    field: string,
    message: string
}

export async function validate(instance): Promise<ValidationError[]> {
    const validateErrors = [];

    await (async function checkLoop(inst, propertyMetadata?, parent?, defaultOptions?) {
        const parentInst = parent ?? inst;

        function addValidateError(field, message) {
            validateErrors.push({
                parent: parentInst,
                field,
                message: message.replace(/\$field/ig, field)
            });
        }

        const checkBasicType = async (value, metadata, options) => {
            let inputCustomValidate: InputCustomValidate;

            switch (
                Array.isArray(inst[metadata.name])
                    ? (options?.arrayType ?? Object)
                    : (options?.enum ?? metadata.type)
            ) {
                case String:
                    inputCustomValidate = IsString();
                    break;
                case Number:
                    inputCustomValidate = IsNumber();
                    break;
                case Boolean:
                    inputCustomValidate = IsBoolean();
                    break;
                case Date:
                    inputCustomValidate = IsDate();
                    break;
                case Object:
                    inputCustomValidate = IsObject();
                    break;
                default:
                    if (options?.enum) {
                        inputCustomValidate = IsEnum(options.enum);
                    }
            }

            if (inputCustomValidate && !await inputCustomValidate.validate(value, inst)) {
                addValidateError(metadata.name, options?.message ?? inputCustomValidate.message);
            }
    
            return !!inputCustomValidate;
        }

        if (propertyMetadata && await checkBasicType(inst, propertyMetadata, defaultOptions))
            return;

        const inputMetadata = getPropertyMetadata(propertyMetadata?.type ?? inst.constructor, 'input');

        for (const eachInputMetadata of inputMetadata) {
            let firstOptions = eachInputMetadata.options[0];
            let defaultOptions: InputDefaultOptions;
            if (firstOptions && !('validate' in firstOptions)) {
                if (firstOptions.disabled)
                    continue;

                defaultOptions = firstOptions;
            }

            const value = inst[eachInputMetadata.name];
            if (value === undefined || value === null) {
                if (eachInputMetadata.required) {
                    addValidateError(eachInputMetadata.name, '$field is required');
                }
            } else {
                if (eachInputMetadata.type === Array) {
                    const isArrayValidate = IsArray();

                    if (await isArrayValidate.validate(value, inst)) {
                        for (const eachValue of value) {
                            await checkLoop(eachValue, eachInputMetadata, inst, defaultOptions);
                        }
                    } else {
                        addValidateError(eachInputMetadata.name, isArrayValidate.message);
                    }
                } else if (!checkBasicType(value, eachInputMetadata, defaultOptions)) {
                    await checkLoop(value, eachInputMetadata, value, defaultOptions);
                }

                for (let i = 0; i < eachInputMetadata.options.length; i++) {
                    const eachOptions = eachInputMetadata.options[i];
                    if (eachOptions && 'validate' in eachOptions) {
                        const nextOptions = eachInputMetadata.options[i + 1];
                        let customOptions: InputCustomOptions;
                        if (nextOptions && !('validate' in eachOptions)) {
                            customOptions = nextOptions;
                            i++;
                        }

                        if (!await eachOptions.validate(value, inst)) {
                            addValidateError(eachInputMetadata.name, customOptions?.message ?? eachOptions.message);
                            break;
                        }
                    }
                }
            }
        }
    })(instance);

    return validateErrors;
}