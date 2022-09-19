/*
 * @Author: wzhaofei wangzf@wellnkiot.com
 * @Date: 2022-09-15 17:54:12
 * @LastEditors: wzhaofei wangzf@wellnkiot.com
 * @LastEditTime: 2022-09-19 22:50:31
 * @FilePath: \mini-vue\src\runtime-core\component.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { PublicInstaceProxyHandlers } from "./componentPublicInstance"

export function createComponentInstance(vnode){
    const component = {
        vnode,
        type:vnode.type,
        setupState:{}
    }

    return component
}

export function setupComponent(instance){
    // TODO
    // initProps()
    // initSlots()

    setupStatefulComponent(instance)
}

function setupStatefulComponent(instance){
    const Component = instance.type

    instance.proxy = new Proxy({
        _:instance
    },PublicInstaceProxyHandlers)

    const { setup } =  Component

    if(setup){
        const setupResult = setup()

        handleSetupResult(instance, setupResult)
    }
}

function handleSetupResult(instance, setupResult){
    if(typeof setupResult === "object"){
        instance.setupState = setupResult
    }
    finishComponentSetup(instance)
}

function finishComponentSetup(instance: any) {
    const Component = instance.type
    instance.render = Component.render
    
    // if(Component.render){
    //     instance.render = Component.render
    // }
}
