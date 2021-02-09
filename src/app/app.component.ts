import { Component, OnInit } from '@angular/core';
import { Business, Input, Output, BusinessModel } from '../../package/src';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

    requestData = {
        name: "joy",
        address: {
            city: "taipei",
            district: "zhongshan",
            street: "my home"
        }
    }

    responseData;
    tempBusiness = {};
    myBusiness;
    Object = Object;
    JSON = JSON;

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
    }
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

@Business()
export class MyBusiness extends BusinessModel {

    @Output()
    @Input({ required: true })
    name: string;

    @Output()
    @Input()
    address: SigningUpAddress;

    artifact = 1;
    artifact2 = 2;
    artifact3 = 3;
    artifact4 = 4;

}
