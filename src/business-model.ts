import { validate, ValidationError } from './validate';

export abstract class BusinessModel<T = any> {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    constructor(data?: Partial<T>) {}

    validate(): Promise<ValidationError[]> {
        return validate(this);
    }
}