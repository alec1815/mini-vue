

export function emit(instance,event:any){
    console.log("emit",event)
    const { props } = instance

    const handler = props["onAdd"]
    handler && handler()
}