import { track, trigger } from "./effect"
import { ReactiveFlags } from "./reactive"

const get = createGetter()
const set = createSetter()
const readonlyGet =  createGetter(true)

function createGetter(isReadonly = false){
    return function get(target,key){
        if(key === ReactiveFlags.IS_REACTIVE){
            return !isReadonly
        }
        const res = Reflect.get(target,key)
        if(!isReadonly){
            track(target,key)
        }
        return res
    }
}

function createSetter(){
    return function set(target,key,value){
        const res = Reflect.set(target,key,value)

            // TODO 触发依赖
            trigger(target,key)
            return res
    }
}

export const mutableHandlers = {
    get,
    set
}

export const readonlyHandlers = {
    get:readonlyGet,
    set(target,key,value){
        console.warn(
            `Set operation on key "${String(key)}" failed: target is readonly.`,
            target
          )
        return true
    }
}