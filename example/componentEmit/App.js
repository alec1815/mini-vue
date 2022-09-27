
import { h } from "../../lib/guid-mini-vue.es.js"
import { Foo } from "./Foo.js"

export const App = {
    name: "App",
    render() {
        // emit
        return h("div", {}, [h("div", {}, "App"), h(Foo, {
            onAdd(a, b) {
                console.log("onAdd", a, b)
            },
            onAddFoo() {
                console.log("onAddFoo")
            }
        })])
    },
    setup() {
        return {}
    }
}