import { h } from "../../lib/guid-mini-vue.es.js"

export const Foo = {
    setup(props) {
        console.log(props)
    },
    render() {
        return h("div", {}, "foo: " + this.count)
    }
}