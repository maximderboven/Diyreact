export const Diyreact = {
    createElement,
    render,
};

/*
ELEMENTS SHOULD BE LIKE THIS:
diyreact.createElement("div",  [
    diyreact.createElement("h1", "Hello World"),
    diyreact.createElement("div", [
        "Hello World",
        diyreact.createElement("p", "This is a paragraph"),
    ]),
const element = {
    tag: "div",
    children: [
        {
            tag: "h1",
            children: "Hello World",
        },
        {
            tag: "div",
            children: [
                {
                    tag: "TEXT",
                    children: {
                        text: "Hello World",
                        },
                },
                {
                    tag: "p",
                    children: [
                        {
                            tag: "TEXT",
                            children: {
                                text: "Hello World",
                                },
                        },
              ],
        },
    ],
};
 */
function createElement(tag, ...children) {
    return {
        tag: tag,
        children: children
    }
}

function render(element, container) {
    if (Array.isArray(element)) {
        element.forEach(e => {
            render(e, container)
        })
    } else if (typeof element === "string") {
        container.appendChild(document.createTextNode(element))
    } else {
        const dom = document.createElement(element.tag)
        element.children.forEach(child => render(child, dom))
        container.appendChild(dom)
    }
    return container;
}
