import { hasOwn } from "../shared/index"


const publicPropertiesMap = {
    $el:(i:any) => i.vnode.el,
    $slots:(i:any)=> i.slots
}

export const PublicInstaceProxyHandlers = {
    get(taget:any, key:any){
        // setupState
        const { _:instance } = taget
        const { setupState,props } = instance
        if(key in setupState){
            return setupState[key]
        }

        if(hasOwn(setupState,key)){
            return setupState[key]
        }else if(hasOwn(props,key)){
            return props[key]
        }

        const publicGetter = publicPropertiesMap[key]

        if(publicGetter){
            return publicGetter(instance)
        }
    }
}