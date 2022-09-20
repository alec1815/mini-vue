import { isObject } from "../shared/index"
import { ShapeFlage } from "../shared/ShapeFlage"
import { createComponentInstance, setupComponent } from "./component"

export function render(vnode,container){
    // patch
    patch(vnode,container)
}

function patch(vnode,container){

    const { shapeFlage } = vnode

    if(shapeFlage & ShapeFlage.ELEMENT){
        procesElement(vnode,container)
    }else if(shapeFlage & ShapeFlage.STATEFUL_COMPONENT){
        // 去处理组件
        procesComponent(vnode,container)
    }
}

function procesElement(vnode,container){
    mountElement(vnode,container)
}

function mountElement(vnode,container){
    const { children, type, props, shapeFlage } = vnode
    
    const el = vnode.el = (document.createElement(type))
    
    if(shapeFlage & ShapeFlage.TEXT_CHILDREN){
        el.textContent = children
    }else if(shapeFlage & ShapeFlage.ARRAY_CHILDREN){
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

function mountComponent(initialVNode,container){
   const instance = createComponentInstance(initialVNode)

   setupComponent(instance)
   setupRenderEffect(initialVNode,instance,container)
}

function setupRenderEffect(initialVNode,instance,container) {

    const { proxy } = instance

    const subTree = instance.render.call(proxy)

    // vnode->patch
    // vnode-> element -> mountElement

    patch(subTree,container)

    initialVNode.el = subTree.el
}
