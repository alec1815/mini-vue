import { ShapeFlage } from "../shared/ShapeFlage"


export function initSlots(instance:any, children:any){
    const {vnode} = instance
    if(vnode.shapeFlage & ShapeFlage.SLOT_CHILDREN){
        normalizeObjectSlots(children,instance.slots)
    }
}

function normalizeObjectSlots(children:any,slots:any) {
    for (const key in children) {
        const value = children[key]
        slots[key] = (props)=>normalizeSkotValue(value(props))
    }
    console.log("initSlots", slots)
    slots = slots
}


function normalizeSkotValue(value:any){
    return Array.isArray(value) ? value : [value]
}