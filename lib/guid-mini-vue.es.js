/*
 * @Author: wzhaofei wangzf@wellnkiot.com
 * @Date: 2022-09-06 16:18:28
 * @LastEditors: wzhaofei wangzf@wellnkiot.com
 * @LastEditTime: 2022-10-18 18:31:08
 * @FilePath: \mini-vue\src\shared\index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const extend = Object.assign;
const isObject = (val) => {
    return val !== null && typeof val === 'object';
};
const hasOwn = (val, key) => Object.prototype.hasOwnProperty.call(val, key);
const camelize = (str) => {
    return str.replace(/-(\w)/g, (_, c) => {
        return c ? c.toLocaleUpperCase() : "";
    });
};
const capitalize = (str) => {
    return str.charAt(0).toLocaleUpperCase() + str.slice(1);
};
const toHandlerKey = (str) => {
    return str ? "on" + capitalize(str) : "";
};

const tagertMap = new Map();
function trigger(tagert, key) {
    let depsMap = tagertMap.get(tagert);
    let dep = depsMap.get(key);
    triggerEffects(dep);
}
function triggerEffects(dep) {
    for (const effect of dep) {
        if (effect.scheduler) {
            effect.scheduler();
        }
        else {
            effect.run();
        }
    }
}

const get = createGetter();
const set = createSetter();
const readonlyGet = createGetter(true);
const shallowReadonlyGet = createGetter(true, true);
function createGetter(isReadonly = false, shallow = false) {
    return function get(target, key) {
        if (key === "__v_isReactive" /* ReactiveFlags.IS_REACTIVE */) {
            return !isReadonly;
        }
        else if (key === "__v_isReadonly" /* ReactiveFlags.IS_READONLY */) {
            return isReadonly;
        }
        const res = Reflect.get(target, key);
        if (shallow) {
            return res;
        }
        if (isObject(res)) {
            return isReadonly ? readonly(res) : reactive(res);
        }
        return res;
    };
}
function createSetter() {
    return function set(target, key, value) {
        const res = Reflect.set(target, key, value);
        // TODO 触发依赖
        trigger(target, key);
        return res;
    };
}
const mutableHandlers = {
    get,
    set
};
const readonlyHandlers = {
    get: readonlyGet,
    set(target, key, value) {
        console.warn(`Set operation on key "${String(key)}" failed: target is readonly.`, target);
        return true;
    }
};
const shallowReadonlyHandlers = extend({}, readonlyHandlers, {
    get: shallowReadonlyGet
});

function createActiveObject(raw, baseHandlers) {
    return new Proxy(raw, baseHandlers);
}
function reactive(raw) {
    return createActiveObject(raw, mutableHandlers);
}
function readonly(raw) {
    return createActiveObject(raw, readonlyHandlers);
}
function shallowReadonly(raw) {
    return createActiveObject(raw, shallowReadonlyHandlers);
}

function emit(instance, event, ...args) {
    console.log("emit", event);
    const { props } = instance;
    const handlerName = toHandlerKey(camelize(event));
    const handler = props[handlerName];
    handler && handler(...args);
}

function initProps(instance, rawProps) {
    instance.props = rawProps || {};
}

const publicPropertiesMap = {
    $el: (i) => i.vnode.el,
    $slots: (i) => i.slots
};
const PublicInstaceProxyHandlers = {
    get(taget, key) {
        // setupState
        const { _: instance } = taget;
        const { setupState, props } = instance;
        if (key in setupState) {
            return setupState[key];
        }
        if (hasOwn(setupState, key)) {
            return setupState[key];
        }
        else if (hasOwn(props, key)) {
            return props[key];
        }
        const publicGetter = publicPropertiesMap[key];
        if (publicGetter) {
            return publicGetter(instance);
        }
    }
};

function initSlots(instance, children) {
    const { vnode } = instance;
    if (vnode.shapeFlage & 16 /* ShapeFlage.SLOT_CHILDREN */) {
        normalizeObjectSlots(children, instance.slots);
    }
}
function normalizeObjectSlots(children, slots) {
    for (const key in children) {
        const value = children[key];
        slots[key] = (props) => normalizeSkotValue(value(props));
    }
    console.log("initSlots", slots);
    slots = slots;
}
function normalizeSkotValue(value) {
    return Array.isArray(value) ? value : [value];
}

function createComponentInstance(vnode) {
    const component = {
        vnode,
        type: vnode.type,
        setupState: {},
        props: {},
        slots: {},
        emit: () => { }
    };
    component.emit = emit.bind(null, component);
    return component;
}
function setupComponent(instance) {
    // TODO
    initProps(instance, instance.vnode.props);
    initSlots(instance, instance.vnode.children);
    setupStatefulComponent(instance);
}
function setupStatefulComponent(instance) {
    const Component = instance.type;
    instance.proxy = new Proxy({
        _: instance
    }, PublicInstaceProxyHandlers);
    const { setup } = Component;
    if (setup) {
        const setupResult = setup(shallowReadonly(instance.props), {
            emit: instance.emit
        });
        handleSetupResult(instance, setupResult);
    }
}
function handleSetupResult(instance, setupResult) {
    if (typeof setupResult === "object") {
        instance.setupState = setupResult;
    }
    finishComponentSetup(instance);
}
function finishComponentSetup(instance) {
    const Component = instance.type;
    instance.render = Component.render;
    // if(Component.render){
    //     instance.render = Component.render
    // }
}

const Fragment = Symbol("Fragment");
const Text = Symbol("Text");
function createVNode(type, props, children) {
    const vnode = {
        type,
        props,
        children,
        shapeFlage: getShapeFlag(type),
        el: null
    };
    if (typeof children === "string") {
        vnode.shapeFlage |= 4 /* ShapeFlage.TEXT_CHILDREN */;
    }
    else if (Array.isArray(children)) {
        vnode.shapeFlage |= 8 /* ShapeFlage.ARRAY_CHILDREN */;
    }
    // 组件 + children object
    if (vnode.shapeFlage & 2 /* ShapeFlage.STATEFUL_COMPONENT */) {
        if (typeof children === "object") {
            vnode.shapeFlage |= 16 /* ShapeFlage.SLOT_CHILDREN */;
        }
    }
    return vnode;
}
function createTextVNode(text) {
    return createVNode(Text, {}, text);
}
function getShapeFlag(type) {
    return typeof type === "string" ? 1 /* ShapeFlage.ELEMENT */ : 2 /* ShapeFlage.STATEFUL_COMPONENT */;
}

function render(vnode, container) {
    // patch
    patch(vnode, container);
}
function patch(vnode, container) {
    const { type, shapeFlage } = vnode;
    switch (type) {
        case Fragment:
            procesFragment(vnode, container);
            break;
        case Text:
            procesText(vnode, container);
            break;
        default:
            if (shapeFlage & 1 /* ShapeFlage.ELEMENT */) {
                procesElement(vnode, container);
            }
            else if (shapeFlage & 2 /* ShapeFlage.STATEFUL_COMPONENT */) {
                // 去处理组件
                procesComponent(vnode, container);
            }
            break;
    }
}
function procesText(vnode, container) {
    // mountChildren(vnode,container)
    const { children } = vnode;
    const textNode = (vnode.el = document.createTextNode(children));
    container.append(textNode);
}
function procesFragment(vnode, container) {
    mountChildren(vnode, container);
}
function procesElement(vnode, container) {
    mountElement(vnode, container);
}
function mountElement(vnode, container) {
    const { children, type, props, shapeFlage } = vnode;
    const el = vnode.el = (document.createElement(type));
    if (shapeFlage & 4 /* ShapeFlage.TEXT_CHILDREN */) {
        el.textContent = children;
    }
    else if (shapeFlage & 8 /* ShapeFlage.ARRAY_CHILDREN */) {
        mountChildren(vnode, el);
    }
    for (const key in props) {
        const val = props[key];
        const isOn = (key) => /^on[A-Z]/.test(key);
        if (isOn(key)) {
            const event = key.slice(2).toLocaleLowerCase();
            el.addEventListener(event, val);
        }
        else {
            el.setAttribute(key, val);
        }
    }
    container.append(el);
}
function mountChildren(vnode, container) {
    vnode.children.forEach(v => {
        patch(v, container);
    });
}
function procesComponent(vnode, container) {
    mountComponent(vnode, container);
}
function mountComponent(initialVNode, container) {
    const instance = createComponentInstance(initialVNode);
    setupComponent(instance);
    setupRenderEffect(initialVNode, instance, container);
}
function setupRenderEffect(initialVNode, instance, container) {
    const { proxy } = instance;
    const subTree = instance.render.call(proxy);
    // vnode->patch
    // vnode-> element -> mountElement
    patch(subTree, container);
    initialVNode.el = subTree.el;
}

function createApp(rootComponent) {
    return {
        mount(rootContainer) {
            // 先转换 vnode
            // component -> vnode
            // 所有逻辑操作 都会基于vnode 做处理
            const vnode = createVNode(rootComponent);
            render(vnode, rootContainer);
        }
    };
}

function h(type, props, children) {
    return createVNode(type, props, children);
}

function renderSlots(slots, name, props) {
    const slot = slots[name];
    if (slot) {
        if (typeof slot === "function") {
            return createVNode(Fragment, {}, slot(props));
        }
    }
}

export { createApp, createTextVNode, h, renderSlots };
