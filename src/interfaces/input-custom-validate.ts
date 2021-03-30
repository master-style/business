export interface InputCustomValidate {
    message: string;
    validate: (value: unknown) => boolean;
}