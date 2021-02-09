# File Structure
```tree
.
├── businesses
│   └── member
│       ├── member.controller.ts
│       ├── member.service.ts
│       ├── member.ts // DAO
│       └── signing-up.ts
└── shared
```

<br>

# Getting Start
```
npm install @master/business
```

<br>

## `tsconfig.json`
```tsx
{
    "compilerOptions": {
        "emitDecoratorMetadata": true,
        "experimentalDecorators": true
	}
}
```

<br>

## `extends BusinessModel`
命名規則：Ving + N

<br>

## `@Business`
裝飾模型

<br>

## `@Input(options?)`
裝飾需驗證格式的欄位

| options     | type                | description                                |
| ----------- | ------------------- | ------------------------------------------ |
| `disabled`  | boolean             | 用於禁用 extends 對象的同樣 @Input() 屬性  |
| `required`  | boolean             | 必輸入                                     |
| `arrayType` | any                 | 類型為 SomeType[] 必須於此額外定義目標類型 |
| `enum`      | Record<string, any> | 類型為 enum 須於此額外定義目標類型         |

<br>

## `@Output(options?)`
裝飾需輸出的欄位
| options    | type    | description                               |
| ---------- | ------- | ----------------------------------------- |
| `disabled` | boolean | 用於禁用 extends 對象的同樣 @Input() 屬性 |

<br>

# 範例
前端藉由 sign-up API 將註冊資料輸入至 Server，Server 再將註冊結果輸出回前端

<br>

## 定義 業務流程之模型
```tsx
// signing-up.ts 
import { Business, BusinessModel, Input } from '@master/business';

@Business()
export class SigningUp extends BusinessModel {

	@Output()
	// 輸入：姓名為字串且必填
	@Input({ required: true })
	name: string;

	// 輸入：地址，根據巢狀類型驗證欄位
	@Output()
    @Input()
	address: SigningUpAddress;

	// 其他業務過程的產物欄位
	a = 1;
	b = 2;
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

## 建立業務過程 ( 以 nestjs 為例 )
```tsx
// member.controller.ts
import { Business, BusinessModel, Input, validate } from '@master/business';
import { Controller, Post, Res, Body } from '@nestjs/common';

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
		// 驗證
		if(errors.length) {
			// 欄位錯誤
			res.status(400).send(errors);
		} else {
			// 欄位正確
			// 註冊相關業務邏輯 ...
            this.memberService.signUp(signingUp);
            res.status(200).send(signingUp);
        }
    }
}
```

## 前端發出的資料 ( Input )
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

## 處理中的模型狀態 ( Model )
```tsx
{
    name: "joy",
    address: {
        city: "taipei",
        district: "zhongshan",
        street: "my home"
    },
    a: 1,
    b: 2
}
```

## 前端接收到的結果 ( Output )
```tsx
{
    name: "joy",
    address: {
        city: "taipei"
    }
}
```

<br>

# @Input 定義範例
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

# 專有名詞
- **DAO** ( Data Access Object )：資料存取物件
- **BM** ( Business Model )：業務模型

<br>

# 獨創名詞
- **BD** ( Business Decorator )：業務裝飾器
- **DID** ( Data Input Decorator )：資料輸入裝飾器
- **DOD** ( Data Output Decorator )：資料輸出裝飾器
- **BLA** ( Business Logic Artifact )：業務邏輯產物

<br>

# 解決問題
- 提供開發者豐富的存取介面
- 遵循 DRY 原則 ( Don't repeat yourself )
- 省去 Request DTO 與 Response DTO 資料結構的定義
- 資料結構專注於一個介面
- 減少程式碼撰寫
- 無需額外定義變數來承接結果
- 無需撰寫特定