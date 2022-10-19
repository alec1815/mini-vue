import { h } from "../../lib/guid-mini-vue.es.js"

export const Foo = {
    setup() {

    },
    render() {
        const foo = h("p", {}, "foo")

        // Foo .vnode children
        console.log(this.$slots)
        return h("div", {}, [foo, this.$slots])
    }
}