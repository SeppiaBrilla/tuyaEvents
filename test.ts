import { _Tuya, Device } from "./easyTuya";
import { Event } from "./tuyaEvents";
import * as dotenv from "dotenv";
dotenv.config();

let dev1 = process.env.DEV1;
let region = process.env.REG;
let key = process.env.KEY;
let secret = process.env.SECRET;
async function testEvents(reg:string, k:string, s:string, d1:string) {
    let api = new _Tuya(reg, k, s);

    let Data_firstEvent = {
        _cause : {
            id:d1, 
            code:'switch_led', 
            value:true
        },
        _effect : {
            id:d1, 
            code:'switch_led', 
            value:false
        },
        _time : 1000,
        _repeat : true,
        _api : api
    }
    let Data_secondEvent = {
        _cause : {
            id:d1, 
            code:'switch_led', 
            value:false
        },
        _effect : {
            id:d1, 
            code:'switch_led', 
            value:true
        },
        _time : 1000,
        _repeat : true,
        _api : api
    }
    let Firstevent = new Event(Data_firstEvent);
    let Secondevent = new Event(Data_secondEvent);
    console.log("events starting");
    Firstevent.start();
    Secondevent.start();
    console.log("done!");
}
testEvents(region as string, key as string, secret as string , dev1 as string);
