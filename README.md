<h1 align="center" style="border-bottom: none;">Master Business</h1>
<h3 align="center">A business data model for quick verification, access and output of specific data formats.</h3>

<p align="center">
  <a href="#" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg" />
  </a>
</p>

  &nbsp;

<p align="center">

> Trust the master, this will make your coding simple.
</p>

## Getting Start
```
npm install @master/business
```

### `tsconfig.json`
```tsx
{
    "compilerOptions": {
        "emitDecoratorMetadata": true,
        "experimentalDecorators": true
    }
}
```

## Usage

```tsx
import { Business, BusinessModel, Input, Output } from '@master/business';

@Business()
export class MyBusiness extends BusinessModel {
    @Input()
    prop1: string;

    @Output()
    prop2: number;

    @Input()
    @Output()
    prop3: OtherBusinessModel;

    ...
}

```

### `@Input(options?)`
Decorate the property that need to be validated

| options     | type                | description                                                                        |
| ----------- | ------------------- | ---------------------------------------------------------------------------------- |
| `disabled`  | boolean             | Used to disable the @Input() decoration behavior of extended objects               |
| `required`  | boolean             | Is the property required                                                           |
| `arrayType` | any                 | Assuming the type is YourType[], the target type must be additionally defined here |
| `enum`      | Record<string, any> | Assuming the type is enum, the target type must be additionally defined here       |

### `@Output(options?)`
Decorate the property that need to be outputed

| options    | type    | description                                                          |
| ---------- | ------- | -------------------------------------------------------------------- |
| `disabled` | boolean | Used to disable the @Input() decoration behavior of extended objects |

## Example
The front-end inputs the registration data to the server through the sign-up API, and then outputs the registration result back to the front-end.

### File Structure
```tree
├── businesses
│   └── member
│       ├── member.controller.ts
│       ├── member.service.ts
│       ├── member.ts // DAO
│       └── signing-up.ts
```

### Define the business model
```tsx
// signing-up.ts 

import { Business, BusinessModel, Input } from '@master/business';

@Business()
export class SigningUp extends BusinessModel {

    @Output()
    @Input({ required: true })
    name: string;

    @Output()
    @Input()
    address: SigningUpAddress;

    @Output()
    type = 'general';

    // other fields for quick access
    a = 1;
    b = 2;
    c = 3;
    d = 4;
}

@Business()
class SigningUpAddress extends BusinessModel {
    
    @Output()
    @Input()
    city: string;

    @Input()
    district: string;
    
    @Input()
    street: string;
}
```

### Process business logic ( nestjs for example )
```tsx
// member.controller.ts

import { Business, BusinessModel, Input, validate } from '@master/business';
import { MemberService } from './member.service.ts';
import { SigningUp } from './signing-up.ts';

@Controller('member')
export class MemberController {
        constructor(
        private memberService: MemberService
    ) {}

    @Post()
    async SignUp(
        @Body() data: any,
        @Res() res: Response
    ): Promise<void> {

        const signingUp = new SigningUp(data);
        const errors = signingUp.validate();

        // validate
        if(errors.length) {
            // property error
            res.status(400).send(errors);
        } else {
            // correct
            // business logic process here ...
            this.memberService.signUp(signingUp);
            res.status(200).send(signingUp);
        }
    }
}
```

### *Input*：request data
```tsx
{
    name: "joy",
    address: {
        city: "taipei",
        district: "zhongshan",
        street: "my home"
    }
}
```

### *Processing*：business data
```tsx
{
    name: "joy",
    address: {
        city: "taipei",
        district: "zhongshan",
        street: "my home"
    },
    type: 'general',
    a: 1,
    b: 2,
    c: 3,
    d: 4
}
```

### *Output*：response data
```tsx
{
    name: "joy",
    address: {
        city: "taipei"
    },
    type: 'general'
}
```

## @Input definitions
```tsx
@Business()
class MyBusiness extends BusinessModel {
    @Input()
    str: string;

    @Input()
    num: number;

    @Input({ enum: MyEnum })
    enum: MyEnum;

    @Input({ arrayType: MyArrayType })
    arrayType: MyArrayType[];
}
```

## Solutions
- ### Provide a rich access interface for developers
- ### Follow the DRY principle (Don't repeat yourself)
- ### Omit the definition of Request DTO and Response DTO data structure
- ### Data structure focuses on one interface
- ### Reduce code writing
- ### No need to define variables individually to manipulate data

## Code Contributors
|[<img alt="BenSeage" src="https://avatars.githubusercontent.com/u/37956868?v=4&s=117" width="117">](https://github.com/BenSeage) |[<img alt="aron-tw" src="https://avatars.githubusercontent.com/u/33840671?v=4&s=117" width="117">](https://github.com/aron-tw) |[<img alt="miles0930" src="https://avatars.githubusercontent.com/u/8224584?v=4&s=117" width="117">](https://github.com/miles0930)  |[<img alt="BenSeage" src="https://avatars.githubusercontent.com/u/8954023?v=4&s=117" width="117">](https://github.com/zxa011023) |
:---:|:---:|:---:|:---:|
[BenSeage](https://github.com/BenSeage)|[Aron](https://github.com/aron-tw)|[Miles](https://github.com/miles0930)|[Lola](https://github.com/zxa011023)|
|creator|designer|maintainer|maintainer