import { isReadonly, shallowReadonly } from "../reactive";

describe("shallowReadonly",()=>{
    test("happy path",()=>{
        const prpos = shallowReadonly({n:{foo:1}})
        expect(isReadonly(prpos)).toBe(true)
        expect(isReadonly(prpos.n)).toBe(false)
    })
})