import { isObject } from "../shared/index"
import { createComponentInstance, setupComponent } from "./component"

export function render(vnode,container){
    // patch
    // 
    patch(vnode,container)
}

function patch(vnode,container){

    if(typeof vnode.type === "string"){
        procesElement(vnode,container)
    }else if(isObject(vnode.type)){
        // 去处理组件
        procesComponent(vnode,container)
    }
}

function procesElement(vnode,container){
    mountElement(vnode,container)
}

function mountElement(vnode,container){
    const { children, type, props } = vnode
    const el = document.createElement(type)
    if(typeof children === "string"){
        el.textContent = children
    }else if(Array.isArray(children)){
        mountChildren(vnode, el)
    }
    
    for (const key in props) {
       const val = props[key]
       el.setAttribute(key, val)
    }
    container.append(el)
}

function mountChildren(vnode,container){
    vnode.children.forEach(v=>{
        patch(v,container)
    })
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

    const { proxy } = instance

    const subTree = instance.render.call(proxy)

    // vnode->patch
    // vnode-> element -> mountElement

    patch(subTree,container)
}
