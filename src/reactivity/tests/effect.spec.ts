import {reactive} from "../reactive"
import {effect,stop} from "../effect"

describe('effect',()=>{
    it('happy path',()=>{
        const user = reactive({
            age:10
        })

        let nextAge
        effect(()=>{
            nextAge = user.age + 1
        })

        expect(nextAge).toBe(11)

        // update
        user.age++
        expect(nextAge).toBe(12)
    })

    it('should return runner when call effect',()=>{
        // 1. effect(fn) -> function(runner) -> fn -> return
        let foo = 10
        const runner = effect(()=>{
            foo++
            return "foo"
        })

        expect(foo).toBe(11)
        const r = runner()
        expect(foo).toBe(12)
        expect(r).toBe("foo")
    })

    it("scheduler", () => {
        // 1、当调用effect时 给定了第二个参数 options 中的  scheduler fn
        // 2、effect第一次执行的时候，会执行fn
        // 3、当 响应式对象 set时，不会执行fn，而是执行scheduler fn
        // 4、当 执行runner函数，才会再次执行fn
    
        let dummy;
        let run: any;
        const scheduler = jest.fn(() => {
          run = runner;
        });
        const obj = reactive({ foo: 1 });
        const runner = effect(
          () => {
            dummy = obj.foo;
          },
          { scheduler }
        );
        expect(scheduler).not.toHaveBeenCalled();
        expect(dummy).toBe(1);
    
        // should be called on first trigger 触发收集依赖
        obj.foo++;
        expect(scheduler).toHaveBeenCalledTimes(1);
    
        // should not run yet
        expect(dummy).toBe(1);
    
        // manually run  手动执行run
        run();
    
        // should have run
        expect(dummy).toBe(2);
    });

    it("stop", () => {
        let dummy;
        const obj = reactive({ prop: 1 });
        const runner = effect(() => {
          dummy = obj.prop;
        });
        obj.prop = 2;
        expect(dummy).toBe(2);
    
        stop(runner);
        // 单纯的触发 set
        // obj.prop = 3;
        // get => set
        obj.prop++;
        expect(dummy).toBe(2);
    
        runner();
        expect(dummy).toBe(3);
    });

    it("onStop", () => {
      let dummy;
      const obj = reactive({ prop: 1 });
      const onStop = jest.fn();
      const runner = effect(
        () => {
          dummy = obj.prop;
        },
        { onStop }
      );
  
      stop(runner);
      expect(onStop).toHaveBeenCalledTimes(1);
    });
})