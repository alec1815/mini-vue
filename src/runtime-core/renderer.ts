import { createComponentInstance, setupComponent } from "./component"

export function render(vnode,container){
    // patch
    // 
    patch(vnode,container)
}

function patch(vnode,container){

    // 去处理组件
    procesComponent(vnode,container)
}

function procesComponent(vnode,container){
    mountComponent(vnode,container)
}

function mountComponent(vnode,container){
   const instance = createComponentInstance(vnode)

   setupComponent(instance)
   setupRenderEffect(instance,container)
}

function setupRenderEffect(instance,container) {
    const subTree = instance.render()

    // vnode->patch
    // vnode-> element -> mountElement

    patch(subTree,container)
}
