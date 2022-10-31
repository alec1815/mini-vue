import { isObject } from "../shared/index"
import { ShapeFlage } from "../shared/ShapeFlage"
import { createComponentInstance, setupComponent } from "./component"
import { Fragment,Text } from "./vnode"

export function render(vnode:any,container:any){
    // patch
    patch(vnode,container)
}

function patch(vnode:any,container:any){

    const { type ,shapeFlage } = vnode

    switch (type) {
        case Fragment:
            procesFragment(vnode,container)
            break;
            case Text:
                procesText(vnode,container)
                break;
        default:
            if(shapeFlage & ShapeFlage.ELEMENT){
                procesElement(vnode,container)
            }else if(shapeFlage & ShapeFlage.STATEFUL_COMPONENT){
                // 去处理组件
                procesComponent(vnode,container)
            }
            break;
    }

    
}

function procesText(vnode: any, container: any) {
    // mountChildren(vnode,container)
    const {children} = vnode
    const textNode = ( vnode.el = document.createTextNode(children))
    container.append(textNode)
}

function procesFragment(vnode: any, container: any) {
    mountChildren(vnode,container)
}

function procesElement(vnode:any,container:any){
    mountElement(vnode,container)
}

function mountElement(vnode:any,container:any){
    const { children, type, props, shapeFlage } = vnode
    
    const el = vnode.el = (document.createElement(type))
    
    if(shapeFlage & ShapeFlage.TEXT_CHILDREN){
        el.textContent = children
    }else if(shapeFlage & ShapeFlage.ARRAY_CHILDREN){
        mountChildren(vnode, el)
    }
    
    for (const key in props) {
       const val = props[key]

       const isOn = (key:string) => /^on[A-Z]/.test(key)

        if(isOn(key)){
            const event = key.slice(2).toLocaleLowerCase()
            el.addEventListener(event, val)
        }else{
            el.setAttribute(key, val)
        }
    }
    container.append(el)
}

function mountChildren(vnode:any,container:any){
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



