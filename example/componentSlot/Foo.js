import { h, renderSlots } from "../../lib/guid-mini-vue.es.js"

export const Foo = {
    setup() {

    },
    render() {
        const foo = h("p", {}, "foo")

        // Foo .vnode children
        console.log(this.$slots)

        // renderSlots
        return h("div", {}, [foo, renderSlots(this.$slots)])
    }
}