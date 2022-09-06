import { extend } from "../shared"

class ReactiveEffect{
    private _fn: any
    deps:any = []
    active = true
    onStop?: ()=>void
    constructor(fn, public scheduler?){
        this._fn = fn 
    }
    run(){
        activeEffect = this
        return this._fn()
    }
    stop(){
        if(this.active){
            cleanupEffect(this)
            if(this.onStop){
                this.onStop()
            }
            this.active = false
        }
        
    }
}

function cleanupEffect(effect){
    effect.deps.forEach((dep:any)=>{
        dep.delete(effect)
    })
}

const tagertMap =  new Map()
export function track(target,key){
    let depsMap = tagertMap.get(target)
    if(!depsMap){
        depsMap = new Map()
        tagertMap.set(target,depsMap)
    }

    let dep = depsMap.get(key)
    if(!dep){
        dep = new Set()
        depsMap.set(key,dep)
    }

    if(!activeEffect) return false

    dep.add(activeEffect)
    activeEffect.deps.push(dep)
}

export function trigger(tagert,key){
    let depsMap  = tagertMap.get(tagert)
    let dep = depsMap.get(key)

    for(const effect of dep){
        if(effect.scheduler){
            effect.scheduler()
        }else{
            effect.run()
        }
    }
}

let activeEffect
export function effect(fn,options:any = {}){
    // fn 
    const _effect = new ReactiveEffect(fn,options.scheduler)
    
    extend(_effect,options)

    _effect.run()

    const runner:any = _effect.run.bind(_effect)
    runner.effect = _effect

    return runner
}

export function stop(runner){
    runner.effect.stop()
}