export interface InputCustomValidate {
    message: string;
    validate: (value: any, instance: any) => boolean;
}