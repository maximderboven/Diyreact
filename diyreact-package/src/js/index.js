function render(element, container) {
    const dom =
        element.tag == "TEXT"
            ? document.createTextNode("")
            : document.createElement(element.tag);
    const isProperty = (key) => key !== "children";
    Object.keys(element.props)
        .filter(isProperty)
        .forEach((name) => {
            dom[name] = element.props[name];
        });
    element.props.children.forEach((element) => {
        render(element, dom);
    });
    if (typeof element.props.attribute != "undefined") {
        if (element.props.attribute != "") {
            const attributes = element.props.attribute.match(
                /([a-zA-Z]+\s?=\s?("\S+"))/g
            );
            attributes.forEach((attribute) => {
                const myattribute = attribute.split("=");
                dom.setAttribute(
                    myattribute[0].replace(" ", ""),
                    myattribute[1].replace(/"/g, "")
                );
            });
        }
    }
    container.appendChild(dom);
    return container;
}

function createElement(tag, attribute, ...children) {
    return {
        tag,
        props: {
            attribute,
            children: children.map((child) =>
                typeof child === "object" ? child : createText(child)
            ),
        },
    };
}

function createText(text) {
    return {
        tag: "TEXT",
        props: {
            nodeValue: text,
            children: [],
        },
    };
}

export const Glacier = {
    createElement,
    render,
};
