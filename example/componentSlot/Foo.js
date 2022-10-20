import { h, renderSlots } from "../../lib/guid-mini-vue.es.js"

export const Foo = {
    setup() {

    },
    render() {
        const foo = h("p", {}, "foo")

        // Foo .vnode children
        console.log(this.$slots)

        // renderSlots
        // 1.渲染的元素
        // 2.渲染的位置
        return h("div", {}, [renderSlots(this.$slots, "header"), foo, renderSlots(this.$slots, "footer")])
    }
}