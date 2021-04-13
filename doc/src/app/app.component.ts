import { Component, OnInit } from '@angular/core';
import { Business, Required, Output, BusinessModel, Optional } from '../../../src';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

    requestData = {
        name: "joy",
        address: {
            // city: "taipei",
            district: "zhongshan",
            street: 'street'
        }
    }

    tempBusiness = {};
    myBusiness: MyBusiness;

    constructor() { }

    ngOnInit(): void {
        this.myBusiness = new MyBusiness(this.requestData);
        console.log(this.myBusiness);

        this.tempBusiness = (function run(target) {
            const tempObj = {};

            for (const key in target) {
                const value = target[key];
                if (Array.isArray(value)) {
                    tempObj[key] = [];
                    for (const eachValue of value) {
                        tempObj[key].push(run(eachValue));
                    }
                } else if (value !== null && typeof value === 'object') {
                    tempObj[key] = run(value);
                } else {
                    tempObj[key] = value;
                }
            }

            return tempObj;
        })(this.myBusiness);

        console.log(this.myBusiness.validate());
    }
}

@Business()
class SigningUpAddress extends BusinessModel {

    @Output()
    @Required()
    city: string;

    @Required()
    district: string;

    @Optional()
    street: string;
}

@Business()
export class MyBusiness extends BusinessModel {

    @Output()
    @Required()
    name: string;

    @Output()
    @Required()
    address: SigningUpAddress;

    artifact = 1;
    artifact2 = 2;
    artifact3 = 3;
    artifact4 = 4;
}
