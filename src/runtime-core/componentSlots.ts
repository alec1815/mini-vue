

export function initSlots(instance:any, children:any){
    const slots = {}
    for (const key in children) {
        const value = children[key]
        slots[key] = Array.isArray(value) ? value : [value]
    }
    console.log("initSlots",slots)
    instance.slots = slots
}