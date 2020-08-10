import * as reactI18next from "react-i18next";
import * as React from "react";

export const hasChildren = (node: React.ReactElement) => node && node.props && node.props.children;

export const getChildren = (node: React.ReactElement) => node.props.children;

const renderNodes = (reactNodes: React.ReactNodeArray|string): React.ReactNode => {
    if (typeof reactNodes === "string") {
        return reactNodes;
    }

    return Object.keys(reactNodes).map((key, i) => {
        const child = reactNodes[key];
        const isElement = React.isValidElement(child);

        if (typeof child === 'string') {
            return child;
        }
        if (hasChildren(child)) {
            const inner = renderNodes(getChildren(child));
            return React.cloneElement(child, {...child.props, key: i}, inner);
        }
        if (typeof child === 'object' && !isElement) {
            return Object.keys(child).reduce((str, childKey) => `${str}${child[childKey]}`, '');
        }

        return child;
    });
};

class I18nextMock extends Array<any> {
    t: ((k: any) => any) | undefined;
    i18n: {} | undefined;

    constructor(t: ((k: any) => any), i18n: {}, ...items: any[]) {
        super(...items);
        this.t = t;
        this.i18n = i18n;
    }
}

export const useMock = new I18nextMock((k: any) => k, {}, (k: any) => k, {})

// this mock makes sure any components using the translate HoC receive the t function as a prop
export const withTranslation = () => (Component: React.ComponentType) => (props: React.Props<any>) => React.createElement(Component, {...props, ...{t: (k: any) => k}});
export const Trans = ({ children }: { children: React.ReactNodeArray }) => renderNodes(children);
export const Translation = (props:any) => props.children((k: any) => k, {lng: "", i18n: {}}, false);
export const useTranslation = () => useMock;

// mock if needed
export const I18nextProvider = reactI18next.I18nextProvider;
export const initReactI18next = reactI18next.initReactI18next;
export const setDefaults = reactI18next.setDefaults;
export const getDefaults = reactI18next.getDefaults;
export const setI18n = reactI18next.setI18n;
export const getI18n = reactI18next.getI18n;
