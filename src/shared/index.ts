/*
 * @Author: wzhaofei wangzf@wellnkiot.com
 * @Date: 2022-09-06 16:18:28
 * @LastEditors: wzhaofei wangzf@wellnkiot.com
 * @LastEditTime: 2022-10-18 18:31:08
 * @FilePath: \mini-vue\src\shared\index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
export const extend = Object.assign

export const isObject = (val:any)=>{
    return val !== null && typeof val === 'object'
}

export const hasChanged =(value:any,newValue:any)=> !Object.is(value,newValue)

export const hasOwn = (val:any,key:any)=> Object.prototype.hasOwnProperty.call(val,key)


export const camelize = (str:string)=>{
    return  str.replace(/-(\w)/g,(_,c:string)=>{
         return c ? c.toLocaleUpperCase() : ""
     })
 }

export  const capitalize = (str:string) =>{
     return str.charAt(0).toLocaleUpperCase() + str.slice(1)
 }

 export  const toHandlerKey = (str:string) =>{
     return str ? "on" +capitalize(str) : ""
 }