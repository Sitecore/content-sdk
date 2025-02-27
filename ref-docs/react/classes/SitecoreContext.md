[**@sitecore-content-sdk/react**](../README.md)

***

[@sitecore-content-sdk/react](../README.md) / SitecoreContext

# Class: SitecoreContext

Defined in: [packages/react/src/components/SitecoreContext.tsx:31](https://github.com/Sitecore/xmc-jss-dev/blob/f4a8fa660d68db3c8a3a184bf4bb6c838e2b1802/packages/react/src/components/SitecoreContext.tsx#L31)

## Extends

- `Component`\<`SitecoreContextProps`, [`SitecoreContextState`](../interfaces/SitecoreContextState.md)\>

## Constructors

### new SitecoreContext()

> **new SitecoreContext**(`props`): [`SitecoreContext`](SitecoreContext.md)

Defined in: [packages/react/src/components/SitecoreContext.tsx:45](https://github.com/Sitecore/xmc-jss-dev/blob/f4a8fa660d68db3c8a3a184bf4bb6c838e2b1802/packages/react/src/components/SitecoreContext.tsx#L45)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `props` | `SitecoreContextProps` |

#### Returns

[`SitecoreContext`](SitecoreContext.md)

#### Overrides

`React.Component<SitecoreContextProps, SitecoreContextState>.constructor`

## Properties

### context

> **context**: `unknown`

Defined in: packages/react/node\_modules/@types/react/index.d.ts:1013

If using the new style context, re-declare this in your class to be the
`React.ContextType` of your `static contextType`.
Should be used with type annotation or static contextType.

#### Example

```ts
static contextType = MyContext
// For TS pre-3.7:
context!: React.ContextType<typeof MyContext>
// For TS 3.7 and above:
declare context: React.ContextType<typeof MyContext>
```

#### See

[React Docs](https://react.dev/reference/react/Component#context)

#### Inherited from

`React.Component.context`

***

### props

> `readonly` **props**: `Readonly`\<`SitecoreContextProps`\>

Defined in: packages/react/node\_modules/@types/react/index.d.ts:1033

#### Inherited from

`React.Component.props`

***

### ~~refs~~

> **refs**: `object`

Defined in: packages/react/node\_modules/@types/react/index.d.ts:1040

#### Index Signature

\[`key`: `string`\]: `ReactInstance`

#### Deprecated

#### See

[Legacy React Docs](https://legacy.reactjs.org/docs/refs-and-the-dom.html#legacy-api-string-refs)

#### Inherited from

`React.Component.refs`

***

### state

> **state**: `Readonly`\<[`SitecoreContextState`](../interfaces/SitecoreContextState.md)\>

Defined in: packages/react/node\_modules/@types/react/index.d.ts:1034

#### Inherited from

`React.Component.state`

***

### contextType?

> `static` `optional` **contextType**: `Context`\<`any`\>

Defined in: packages/react/node\_modules/@types/react/index.d.ts:995

If set, `this.context` will be set at runtime to the current value of the given Context.

#### Example

```ts
type MyContext = number
const Ctx = React.createContext<MyContext>(0)

class Foo extends React.Component {
  static contextType = Ctx
  context!: React.ContextType<typeof Ctx>
  render () {
    return <>My context's value: {this.context}</>;
  }
}
```

#### See

[https://react.dev/reference/react/Component#static-contexttype](https://react.dev/reference/react/Component#static-contexttype)

#### Inherited from

`React.Component.contextType`

***

### displayName

> `static` **displayName**: `string` = `'SitecoreContext'`

Defined in: [packages/react/src/components/SitecoreContext.tsx:43](https://github.com/Sitecore/xmc-jss-dev/blob/f4a8fa660d68db3c8a3a184bf4bb6c838e2b1802/packages/react/src/components/SitecoreContext.tsx#L43)

***

### propTypes

> `static` **propTypes**: `object`

Defined in: [packages/react/src/components/SitecoreContext.tsx:32](https://github.com/Sitecore/xmc-jss-dev/blob/f4a8fa660d68db3c8a3a184bf4bb6c838e2b1802/packages/react/src/components/SitecoreContext.tsx#L32)

#### children

> **children**: `Validator`\<`any`\> = `PropTypes.any.isRequired`

#### componentFactory

> **componentFactory**: `Requireable`\<(...`args`) => `any`\> = `PropTypes.func`

#### layoutData

> **layoutData**: `Requireable`\<`InferProps`\<\{ `sitecore`: `Requireable`\<`InferProps`\<\{ `context`: `Requireable`\<`any`\>; `route`: `Requireable`\<`any`\>; \}\>\>; \}\>\>

## Methods

### componentDidCatch()?

> `optional` **componentDidCatch**(`error`, `errorInfo`): `void`

Defined in: packages/react/node\_modules/@types/react/index.d.ts:1397

Catches exceptions generated in descendant components. Unhandled exceptions will cause
the entire component tree to unmount.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `error` | `Error` |
| `errorInfo` | `ErrorInfo` |

#### Returns

`void`

#### Inherited from

`React.Component.componentDidCatch`

***

### componentDidMount()?

> `optional` **componentDidMount**(): `void`

Defined in: packages/react/node\_modules/@types/react/index.d.ts:1376

Called immediately after a component is mounted. Setting state here will trigger re-rendering.

#### Returns

`void`

#### Inherited from

`React.Component.componentDidMount`

***

### componentDidUpdate()

> **componentDidUpdate**(`prevProps`): `void`

Defined in: [packages/react/src/components/SitecoreContext.tsx:70](https://github.com/Sitecore/xmc-jss-dev/blob/f4a8fa660d68db3c8a3a184bf4bb6c838e2b1802/packages/react/src/components/SitecoreContext.tsx#L70)

Called immediately after updating occurs. Not called for the initial render.

The snapshot is only present if [getSnapshotBeforeUpdate](SitecoreContext.md#getsnapshotbeforeupdate) is present and returns non-null.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `prevProps` | `SitecoreContextProps` |

#### Returns

`void`

#### Overrides

`React.Component.componentDidUpdate`

***

### ~~componentWillMount()?~~

> `optional` **componentWillMount**(): `void`

Defined in: packages/react/node\_modules/@types/react/index.d.ts:1455

Called immediately before mounting occurs, and before Component.render.
Avoid introducing any side-effects or subscriptions in this method.

Note: the presence of NewLifecycle.getSnapshotBeforeUpdate getSnapshotBeforeUpdate
or StaticLifecycle.getDerivedStateFromProps getDerivedStateFromProps prevents
this from being invoked.

#### Returns

`void`

#### Deprecated

16.3, use ComponentLifecycle.componentDidMount componentDidMount or the constructor instead; will stop working in React 17

#### See

 - [https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#initializing-state](https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#initializing-state)
 - [https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path](https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path)

#### Inherited from

`React.Component.componentWillMount`

***

### ~~componentWillReceiveProps()?~~

> `optional` **componentWillReceiveProps**(`nextProps`, `nextContext`): `void`

Defined in: packages/react/node\_modules/@types/react/index.d.ts:1486

Called when the component may be receiving new props.
React may call this even if props have not changed, so be sure to compare new and existing
props if you only want to handle changes.

Calling Component.setState generally does not trigger this method.

Note: the presence of NewLifecycle.getSnapshotBeforeUpdate getSnapshotBeforeUpdate
or StaticLifecycle.getDerivedStateFromProps getDerivedStateFromProps prevents
this from being invoked.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `nextProps` | `Readonly`\<`SitecoreContextProps`\> |
| `nextContext` | `any` |

#### Returns

`void`

#### Deprecated

16.3, use static StaticLifecycle.getDerivedStateFromProps getDerivedStateFromProps instead; will stop working in React 17

#### See

 - [https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#updating-state-based-on-props](https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#updating-state-based-on-props)
 - [https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path](https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path)

#### Inherited from

`React.Component.componentWillReceiveProps`

***

### componentWillUnmount()?

> `optional` **componentWillUnmount**(): `void`

Defined in: packages/react/node\_modules/@types/react/index.d.ts:1392

Called immediately before a component is destroyed. Perform any necessary cleanup in this method, such as
cancelled network requests, or cleaning up any DOM elements created in `componentDidMount`.

#### Returns

`void`

#### Inherited from

`React.Component.componentWillUnmount`

***

### ~~componentWillUpdate()?~~

> `optional` **componentWillUpdate**(`nextProps`, `nextState`, `nextContext`): `void`

Defined in: packages/react/node\_modules/@types/react/index.d.ts:1518

Called immediately before rendering when new props or state is received. Not called for the initial render.

Note: You cannot call Component.setState here.

Note: the presence of NewLifecycle.getSnapshotBeforeUpdate getSnapshotBeforeUpdate
or StaticLifecycle.getDerivedStateFromProps getDerivedStateFromProps prevents
this from being invoked.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `nextProps` | `Readonly`\<`SitecoreContextProps`\> |
| `nextState` | `Readonly`\<[`SitecoreContextState`](../interfaces/SitecoreContextState.md)\> |
| `nextContext` | `any` |

#### Returns

`void`

#### Deprecated

16.3, use getSnapshotBeforeUpdate instead; will stop working in React 17

#### See

 - [https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#reading-dom-properties-before-an-update](https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#reading-dom-properties-before-an-update)
 - [https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path](https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path)

#### Inherited from

`React.Component.componentWillUpdate`

***

### constructContext()

> **constructContext**(`layoutData`?): [`SitecoreContextValue`](../type-aliases/SitecoreContextValue.md)

Defined in: [packages/react/src/components/SitecoreContext.tsx:56](https://github.com/Sitecore/xmc-jss-dev/blob/f4a8fa660d68db3c8a3a184bf4bb6c838e2b1802/packages/react/src/components/SitecoreContext.tsx#L56)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `layoutData`? | [`LayoutServiceData`](../interfaces/LayoutServiceData.md) |

#### Returns

[`SitecoreContextValue`](../type-aliases/SitecoreContextValue.md)

***

### forceUpdate()

> **forceUpdate**(`callback`?): `void`

Defined in: packages/react/node\_modules/@types/react/index.d.ts:1030

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `callback`? | () => `void` |

#### Returns

`void`

#### Inherited from

`React.Component.forceUpdate`

***

### getSnapshotBeforeUpdate()?

> `optional` **getSnapshotBeforeUpdate**(`prevProps`, `prevState`): `any`

Defined in: packages/react/node\_modules/@types/react/index.d.ts:1433

Runs before React applies the result of Component.render render to the document, and
returns an object to be given to [componentDidUpdate](SitecoreContext.md#componentdidupdate). Useful for saving
things such as scroll position before Component.render render causes changes to it.

Note: the presence of this method prevents any of the deprecated
lifecycle events from running.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `prevProps` | `Readonly`\<`SitecoreContextProps`\> |
| `prevState` | `Readonly`\<[`SitecoreContextState`](../interfaces/SitecoreContextState.md)\> |

#### Returns

`any`

#### Inherited from

`React.Component.getSnapshotBeforeUpdate`

***

### render()

> **render**(): `Element`

Defined in: [packages/react/src/components/SitecoreContext.tsx:93](https://github.com/Sitecore/xmc-jss-dev/blob/f4a8fa660d68db3c8a3a184bf4bb6c838e2b1802/packages/react/src/components/SitecoreContext.tsx#L93)

#### Returns

`Element`

#### Overrides

`React.Component.render`

***

### setContext()

> **setContext**(`value`): `void`

Defined in: [packages/react/src/components/SitecoreContext.tsx:85](https://github.com/Sitecore/xmc-jss-dev/blob/f4a8fa660d68db3c8a3a184bf4bb6c838e2b1802/packages/react/src/components/SitecoreContext.tsx#L85)

Update context state. Value can be

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | [`LayoutServiceData`](../interfaces/LayoutServiceData.md) \| [`SitecoreContextValue`](../type-aliases/SitecoreContextValue.md) | New context value |

#### Returns

`void`

***

### setState()

> **setState**\<`K`\>(`state`, `callback`?): `void`

Defined in: packages/react/node\_modules/@types/react/index.d.ts:1025

#### Type Parameters

| Type Parameter |
| ------ |
| `K` *extends* keyof [`SitecoreContextState`](../interfaces/SitecoreContextState.md) |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `state` | [`SitecoreContextState`](../interfaces/SitecoreContextState.md) \| (`prevState`, `props`) => [`SitecoreContextState`](../interfaces/SitecoreContextState.md) \| `Pick`\<[`SitecoreContextState`](../interfaces/SitecoreContextState.md), `K`\> \| `Pick`\<[`SitecoreContextState`](../interfaces/SitecoreContextState.md), `K`\> |
| `callback`? | () => `void` |

#### Returns

`void`

#### Inherited from

`React.Component.setState`

***

### shouldComponentUpdate()?

> `optional` **shouldComponentUpdate**(`nextProps`, `nextState`, `nextContext`): `boolean`

Defined in: packages/react/node\_modules/@types/react/index.d.ts:1387

Called to determine whether the change in props and state should trigger a re-render.

`Component` always returns true.
`PureComponent` implements a shallow comparison on props and state and returns true if any
props or states have changed.

If false is returned, Component.render, `componentWillUpdate`
and `componentDidUpdate` will not be called.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `nextProps` | `Readonly`\<`SitecoreContextProps`\> |
| `nextState` | `Readonly`\<[`SitecoreContextState`](../interfaces/SitecoreContextState.md)\> |
| `nextContext` | `any` |

#### Returns

`boolean`

#### Inherited from

`React.Component.shouldComponentUpdate`

***

### ~~UNSAFE\_componentWillMount()?~~

> `optional` **UNSAFE\_componentWillMount**(): `void`

Defined in: packages/react/node\_modules/@types/react/index.d.ts:1470

Called immediately before mounting occurs, and before Component.render.
Avoid introducing any side-effects or subscriptions in this method.

This method will not stop working in React 17.

Note: the presence of NewLifecycle.getSnapshotBeforeUpdate getSnapshotBeforeUpdate
or StaticLifecycle.getDerivedStateFromProps getDerivedStateFromProps prevents
this from being invoked.

#### Returns

`void`

#### Deprecated

16.3, use ComponentLifecycle.componentDidMount componentDidMount or the constructor instead

#### See

 - [https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#initializing-state](https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#initializing-state)
 - [https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path](https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path)

#### Inherited from

`React.Component.UNSAFE_componentWillMount`

***

### ~~UNSAFE\_componentWillReceiveProps()?~~

> `optional` **UNSAFE\_componentWillReceiveProps**(`nextProps`, `nextContext`): `void`

Defined in: packages/react/node\_modules/@types/react/index.d.ts:1504

Called when the component may be receiving new props.
React may call this even if props have not changed, so be sure to compare new and existing
props if you only want to handle changes.

Calling Component.setState generally does not trigger this method.

This method will not stop working in React 17.

Note: the presence of NewLifecycle.getSnapshotBeforeUpdate getSnapshotBeforeUpdate
or StaticLifecycle.getDerivedStateFromProps getDerivedStateFromProps prevents
this from being invoked.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `nextProps` | `Readonly`\<`SitecoreContextProps`\> |
| `nextContext` | `any` |

#### Returns

`void`

#### Deprecated

16.3, use static StaticLifecycle.getDerivedStateFromProps getDerivedStateFromProps instead

#### See

 - [https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#updating-state-based-on-props](https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#updating-state-based-on-props)
 - [https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path](https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path)

#### Inherited from

`React.Component.UNSAFE_componentWillReceiveProps`

***

### ~~UNSAFE\_componentWillUpdate()?~~

> `optional` **UNSAFE\_componentWillUpdate**(`nextProps`, `nextState`, `nextContext`): `void`

Defined in: packages/react/node\_modules/@types/react/index.d.ts:1534

Called immediately before rendering when new props or state is received. Not called for the initial render.

Note: You cannot call Component.setState here.

This method will not stop working in React 17.

Note: the presence of NewLifecycle.getSnapshotBeforeUpdate getSnapshotBeforeUpdate
or StaticLifecycle.getDerivedStateFromProps getDerivedStateFromProps prevents
this from being invoked.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `nextProps` | `Readonly`\<`SitecoreContextProps`\> |
| `nextState` | `Readonly`\<[`SitecoreContextState`](../interfaces/SitecoreContextState.md)\> |
| `nextContext` | `any` |

#### Returns

`void`

#### Deprecated

16.3, use getSnapshotBeforeUpdate instead

#### See

 - [https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#reading-dom-properties-before-an-update](https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#reading-dom-properties-before-an-update)
 - [https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path](https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path)

#### Inherited from

`React.Component.UNSAFE_componentWillUpdate`
