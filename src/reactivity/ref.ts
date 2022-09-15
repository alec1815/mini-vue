import { hasChanged, isObject } from "../shared";
import { isTracking, trackEffects, triggerEffects } from "./effect";
import { reactive } from "./reactive";

class RefImpl{
    private _value: any;
    public dep
    private _rawVlaue: any;
    public __v_isRef = true
    constructor(value){
        this._value = convert(value)
        this._rawVlaue = value
        this.dep = new Set()
    }
    get value(){
        trackRefValue(this)
        return this._value  
    }
    set value(newValue){
        if(hasChanged(this._rawVlaue,newValue)){
            this._rawVlaue = newValue
            this._value = convert(newValue)
            triggerEffects(this.dep)
        }
        
    }
}

function convert(value){
    return isObject(value) ? reactive(value) : value
}

function trackRefValue(ref){
    if(isTracking()){
        trackEffects(ref.dep)
    }
}

export function ref(value){
    return new RefImpl(value)
}

// __v_isRef
export function isRef(ref){
    return !!ref.__v_isRef
}