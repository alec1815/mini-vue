

const publicPropertiesMap = {
    $el:(i) => i.vnode.el
}


export const PublicInstaceProxyHandlers = {
    get(taget, key){
        // setupState
        const { _:instance } = taget
        const { setupState } = instance
        if(key in setupState){
            return setupState[key]
        }
        const publicGetter = publicPropertiesMap[key]

        if(publicGetter){
            return publicGetter(instance)
        }
    }
}