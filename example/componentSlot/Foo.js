import { h, renderSlots } from "../../lib/guid-mini-vue.es.js"

export const Foo = {
    setup() {

    },
    render() {
        const foo = h("p", {}, "foo")

        // Foo .vnode children
        console.log(this.$slots)

        // renderSlots
        // 具名插槽
        // 1.渲染的元素
        // 2.渲染的位置
        // 作用域插槽
        const age = 1
        return h("div", {}, [renderSlots(this.$slots, "header", { age }), foo, renderSlots(this.$slots, "footer")])
    }
}