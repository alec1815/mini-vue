import { h } from "../../lib/guid-mini-vue.es.js"

export const Foo = {
    setup() {

    },
    render() {
        const foo = h("p", {}, "foo")
        return h("div", {}, [foo, btn])
    }
}