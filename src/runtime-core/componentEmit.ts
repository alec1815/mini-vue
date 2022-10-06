import { camelize, toHandlerKey } from "../shared/index"

export function emit(instance:any,event:any,...args:any){
    console.log("emit",event)
    const { props } = instance

    const handlerName = toHandlerKey(camelize(event))
    const handler = props[handlerName]
    handler && handler(...args)
}