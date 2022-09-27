

export function emit(instance,event:any){
    console.log("emit",event)
    const { props } = instance

    const capitalize = (str:string) =>{
        return str.charAt(0).toLocaleUpperCase() + str.slice(1)
    }

    const toHandlerKey = (str:string) =>{
        return str ? "on" +capitalize(event) : ""
    }

    const handlerName = toHandlerKey(event)
    const handler = props[handlerName]
    handler && handler()
}