**CONTENTS**

# 專有名詞

**DAO** ( Data Access Object )：資料存取物件

**BM** ( Business Model )：業務模型

# 獨創名詞

**BD** ( Business Decorator )：業務裝飾器 `@Business`

**DID** ( Data Input Decorator )：資料輸入裝飾器 `@Input`

**DOD** ( Data Output Decorator )：資料輸出裝飾器 `@Output`

**BLA** ( Business Logic Artifact )：業務邏輯產物

# 解決問題

將 **BD** 作為該次業務邏輯執行的資料傳輸載體，蒐集業務邏輯產生的結果，單一欄位可能是：

- **DAO** 資料存取物件
- **BLA** 業務邏輯產物
- **DID** 對象
- **DOD** 對象
1. 提供開發者豐富的存取介面
2. 遵循 DRY 原則 ( Don't repeat yourself )
3. 省去 Request DTO 與 Response DTO 資料結構的定義
4. 資料結構專注於一個介面
5. 減少程式碼撰寫
    - 無需額外定義變數來承接結果
    - 無需撰寫特定

# 檔案結構

```json
.
├── businesses
│   └── member
│       ├── member.controller.ts
│       ├── member.service.ts
│       ├── member.ts // DAO
│       └── signing-up.ts
└── shared
```

# Getting Start

```basic
npm install @master/business
```

tsconfig.json

```tsx
{
    "compilerOptions": {
        "emitDecoratorMetadata": true,
        "experimentalDecorators": true
		}
}
```

## 類別

- `BusinessModel` 業務模型 ( Naming：Ving / Ving + N )

## 裝飾器

- `@Business` 裝飾模型
- `@Input(options?)` 裝飾需驗證格式的欄位

    ```tsx
    // optios
    disabled? : boolean // 用於禁用 extends 對象的同樣 @Input() 屬性
    required? : boolean // 必輸
    arrayType? : any // 類型為 SomeType[] 必須於此額外定義目標類型
    enum? : Record<string, any> // 類型為 enum 須於此額外定義目標類型
    ```

- `@Output(options?)` 裝飾需輸出的欄位

    ```tsx
    // optios
    disabled? : boolean // 用於禁用 extends 對象的同樣 @Output() 屬性
    ```

## 範例

前端藉由 sign-up API 將註冊資料輸入至 Server，Server 再將註冊結果輸出回前端

### 定義 業務流程之模型

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
	...
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

### 建立業務過程 ( 以 nestjs 為例 )

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

### 前端發出的資料 ( Input )

```json
{
		name: "joy",
		address: {
				city: "taipei",
				district: "zhongshan",
				street: "my home"
		}
}
```

### 處理中的模型狀態 ( Model )

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

### 前端接收到的結果 ( Output )

```json
{
		name: "joy",
		address: {
				city: "taipei"
		}
}
```

## @Input 定義範例

```tsx
@Input()
str: string;

@Input()
num: number = 0;

@Input({ enum: MyEnum })
enum: MyEnum;

@Input({ arrayType: MyArrayType })
arrayType: MyArrayType[];
```