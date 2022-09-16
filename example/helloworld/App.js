
import { h } from "../../lib/guid-mini-vue.es.js"

export const App = {
    render() {
        return h(
            "div",
            {
                id: "root",
                class: ["red", "hard"]
            },
            [h("p", { class: "red" }, "hi"), h("p", { class: "blue" }, "mini-vue")]
            // "hi, mini-vue"
            // "hi, " + this.msg
        )
    },
    setup() {
        return {
            msg: "mini-vue"
        }
    }
}