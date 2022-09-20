const publicPropertiesMap = {
    $el: (i) => i.vnode.el
};
const PublicInstaceProxyHandlers = {
    get(taget, key) {
        // setupState
        const { _: instance } = taget;
        const { setupState } = instance;
        if (key in setupState) {
            return setupState[key];
        }
        const publicGetter = publicPropertiesMap[key];
        if (publicGetter) {
            return publicGetter(instance);
        }
    }
};

function createComponentInstance(vnode) {
    const component = {
        vnode,
        type: vnode.type,
        setupState: {}
    };
    return component;
}
function setupComponent(instance) {
    // TODO
    // initProps()
    // initSlots()
    setupStatefulComponent(instance);
}
function setupStatefulComponent(instance) {
    const Component = instance.type;
    instance.proxy = new Proxy({
        _: instance
    }, PublicInstaceProxyHandlers);
    const { setup } = Component;
    if (setup) {
        const setupResult = setup();
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

function render(vnode, container) {
    // patch
    patch(vnode, container);
}
function patch(vnode, container) {
    const { shapeFlage } = vnode;
    if (shapeFlage & 1 /* ShapeFlage.ELEMENT */) {
        procesElement(vnode, container);
    }
    else if (shapeFlage & 2 /* ShapeFlage.STATEFUL_COMPONENT */) {
        // 去处理组件
        procesComponent(vnode, container);
    }
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
        if (key === "onClick") {
            el.addEventListener("click", val);
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
    return vnode;
}
function getShapeFlag(type) {
    return typeof type === "string" ? 1 /* ShapeFlage.ELEMENT */ : 2 /* ShapeFlage.STATEFUL_COMPONENT */;
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

export { createApp, h };
