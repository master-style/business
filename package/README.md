<h1 align="center" style="border-bottom: none;">Master Business</h1>
<h3 align="center">A business data model for quick verification, access and output of specific data formats.</h3>

<div align="center" style="margin-top: 1rem">
  <a href="#" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg" />
  </a>
  &nbsp;
</div>

<br>

> Trust the master, this will make your coding simple.

<br>

## Getting Start
```
npm install @master/business
```

<br>

### `tsconfig.json`
```tsx
{
    "compilerOptions": {
        "emitDecoratorMetadata": true,
        "experimentalDecorators": true
    }
}
```

<br>

## Usage

```tsx
import { Business, BusinessModel, Input, Output } from '@master/business';

@Business()
export class MyBusiness extends BusinessModel { }

```

### `@Input(options?)`
Decorate the property that need to be validated

| options     | type                | description                                                                        |
| ----------- | ------------------- | ---------------------------------------------------------------------------------- |
| `disabled`  | boolean             | Used to disable the @Input() decoration behavior of extended objects               |
| `required`  | boolean             | Is the property required                                                              |
| `arrayType` | any                 | Assuming the type is YourType[], the target type must be additionally defined here |
| `enum`      | Record<string, any> | Assuming the type is enum, the target type must be additionally defined here       |

<br>

### `@Output(options?)`
Decorate the property that need to be outputed

| options    | type    | description                                                          |
| ---------- | ------- | -------------------------------------------------------------------- |
| `disabled` | boolean | Used to disable the @Input() decoration behavior of extended objects |

<br>

## Example
The front-end inputs the registration data to the server through the sign-up API, and then outputs the registration result back to the front-end.

### File Structure
```tree
.
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

<br>

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

### *Input*：Request data
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

### *Processing*
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

### *Output*：Response data
```tsx
{
    name: "joy",
    address: {
        city: "taipei"
    },
    type: 'general'
}
```

<br>

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

<br>

## Solutions
- ### Provide a rich access interface for developers
- ### Follow the DRY principle (Don't repeat yourself)
- ### Omit the definition of Request DTO and Response DTO data structure
- ### Data structure focuses on one interface
- ### Reduce code writing
- ### No need to define variables individually to manipulate data
- ### No need to write specific

<br>

## Code Contributors

<div style="display: inline-block; width: 100px; margin-top: 1rem; margin-right: 1rem" align="center">

[![Ben Seage](https://avatars.githubusercontent.com/u/37956868?v=4)](https://github.com/BenSeage)
Ben Seage
<small style="display: block">creator</small>
</div>

<div style="display: inline-block; width: 100px; margin-top: 1rem; margin-right: 1rem" align="center">

[![Aron](https://avatars.githubusercontent.com/u/33840671?v=4)](https://github.com/aron-tw)
Aron
<small style="display: block">designer</small>
</div>

<div style="display: inline-block; width: 100px; margin-top: 1rem; margin-right: 1rem" align="center">

[![Miles](https://avatars.githubusercontent.com/u/8224584)](https://github.com/miles0930)
Miles
<small style="display: block">maintainer</small>
</div>

<div style="display: inline-block; width: 100px; margin-top: 1rem; margin-right: 1rem" align="center">

[![Lola](https://avatars.githubusercontent.com/u/8954023)](https://github.com/zxa011023)
Lola
<small style="display: block">maintainer</small>
</div>