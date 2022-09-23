import { hasOwn } from "../shared/index"


const publicPropertiesMap = {
    $el:(i) => i.vnode.el
}


export const PublicInstaceProxyHandlers = {
    get(taget, key){
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