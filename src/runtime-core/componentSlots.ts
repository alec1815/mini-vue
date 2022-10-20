

export function initSlots(instance:any, children:any){
    normalizeObjectSlots(children,instance.slots)
}

function normalizeObjectSlots(children,slots) {
    for (const key in children) {
        const value = children[key]
        slots[key] = normalizeSkotValue(value)
    }
    console.log("initSlots", slots)
    slots = slots
}


function normalizeSkotValue(value){
    return Array.isArray(value) ? value : [value]
}