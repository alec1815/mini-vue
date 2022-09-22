
import { h } from "../../lib/guid-mini-vue.es.js"
import { Foo } from "./Foo.js"

window.self = null

export const App = {
    render() {
        window.self = this
        return h(
            "div",
            {
                id: "root",
                class: ["red", "hard"],
                onClick() {
                    console.log("click")
                },
                onMousedown() {
                    console.log("mousedown")
                }
            },
            [h("div", {}, "hi," + this.msg), h(Foo, {
                const: 1
            })]
            // [h("p", { class: "red" }, "hi"), h("p", { class: "blue" }, "mini-vue")]
            // "hi, mini-vue"
            // "hi, " + this.msg
        )
    },
    setup() {
        return {
            msg: "mini-vue haha"
        }
    }
}