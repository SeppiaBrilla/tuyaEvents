import { TuyaResponse } from "@tuya/tuya-connector-nodejs";
import { Device, _Tuya } from "./easyTuya";

interface ev{
    id:string, 
    code:string, 
    value:any
}

class Event{
    private cause:ev
    private effect:ev
    private time:number
    private api: _Tuya
    private repeat:boolean

    constructor(event:{_cause:ev, _effect:ev, _time:number, _repeat:boolean, _api: _Tuya}){
        this.cause = event._cause;
        this.effect = event._effect;
        this.time = event._time;
        this.api = event._api;
        this.repeat = event._repeat;
    }

    private async check(){
        let device = new Device(this.cause.id,this.api);
        let data = await device.getData();
        let element = this.getElement((data as any).result.status, this.cause.code)
        return element.value == this.cause.value;

    }
    private getElement(array:Array<any>, code: string){
        for(let i = 0; i < array.length; i++){
            if(array[i].code == code){
                return array[i]
            }
        }
        return -1
    }
    private exec(){
        let device = new Device(this.effect.id, this.api);
        let data = {
            "code":this.effect.code,
            "value":this.effect.value
        }
        device.control([data]);
    }
    async start(){
        while(true){
            let response:boolean = await this.check();
            if(response){
                this.exec()
                if(!this.repeat){
                    return;
                }
            }
            await delay(this.time)
        }
    }
}

function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}


export {Event}