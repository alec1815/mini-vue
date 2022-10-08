/*
 * @Author: wzhaofei wangzf@wellnkiot.com
 * @Date: 2022-09-17 16:46:39
 * @LastEditors: wzhaofei wangzf@wellnkiot.com
 * @LastEditTime: 2022-10-08 21:00:02
 * @FilePath: \mini-vue\src\runtime-core\componentPublicInstance.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { hasOwn } from "../shared/index"


const publicPropertiesMap = {
    $el:(i:any) => i.vnode.el
}

export const PublicInstaceProxyHandlers = {
    get(taget:any, key:any){
        // setupState
        const { _:instance } = taget
        const { setupState,props } = instance
        if(key in setupState){
            return setupState[key]
        }

        if(hasOwn(setupState,key)){
            return setupState[key]
        }else if(hasOwn(props,key)){
            return props[key]
        }

        const publicGetter = publicPropertiesMap[key]

        if(publicGetter){
            return publicGetter(instance)
        }
    }
}