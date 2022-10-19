/*
 * @Author: wzhaofei wangzf@wellnkiot.com
 * @Date: 2022-10-14 15:58:00
 * @LastEditors: wzhaofei wangzf@wellnkiot.com
 * @LastEditTime: 2022-10-19 17:40:14
 * @FilePath: \mini-vue\example\componentSlot\App.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import { h } from "../../lib/guid-mini-vue.es.js"
import { Foo } from "./Foo.js"

export const App = {
    name: "App",
    render() {
        const app = h("div", {}, "App")
        const foo = h(Foo, {}, h("p", {}, "123"))
        return h("div", {}, [app, foo])
    },
    setup() {
        return {}
    }
}