export interface InputCustomValidate {
    message: string;
    validate: (value: unknown, instance: unknown) => boolean;
}