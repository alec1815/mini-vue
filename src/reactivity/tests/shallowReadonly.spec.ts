import { isReadonly, shallowReadonly } from "../reactive";

describe("shallowReadonly",()=>{
    it("happy path",()=>{
        const prpos = shallowReadonly({n:{foo:1}})
        expect(isReadonly(prpos)).toBe(true)
        expect(isReadonly(prpos.n)).toBe(false)
    })
    it('warn then call set', ()=>{

        console.warn = jest.fn()

        const user = shallowReadonly({
            age:10
        })

        user.age = 11

        expect(console.warn).toBeCalled()
    })
})