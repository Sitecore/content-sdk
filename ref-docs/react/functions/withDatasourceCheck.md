[**@sitecore-content-sdk/react**](../README.md)

***

[@sitecore-content-sdk/react](../README.md) / withDatasourceCheck

# Function: withDatasourceCheck()

> **withDatasourceCheck**(`options?`): \<`ComponentProps`\>(`Component`) => (`props`) => `Element` \| `null`

Defined in: [packages/react/src/enhancers/withDatasourceCheck.tsx:54](https://github.com/Sitecore/content-sdk/blob/b858df1f6f27c4f7a00a2d33c81c5e5233790233/packages/react/src/enhancers/withDatasourceCheck.tsx#L54)

Checks whether a Sitecore datasource is present and valid, then renders appropriately depending on page mode (normal vs editing).
`isContentResolved: false` is treated the same as a missing datasource. If the property is omitted, the original presence check is used.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `options?` | `WithDatasourceCheckOptions` | - |

## Returns

The wrapped component, if a datasource is present and valid.
 A null component (in normal mode) or an error component (in editing mode), if a datasource is missing or failed to resolve.

\<`ComponentProps`\>(`Component`) => (`props`) => `Element` \| `null`

## Example

```ts
// Wrap once. Deleted/archived datasources (isContentResolved: false) use the same
// fallback as a missing datasource: hide in normal mode, show an editing error in editing mode.
const ContentBlock = (props) => <div>{props.fields.heading}</div>;
export default withDatasourceCheck()(ContentBlock);

// Layout Service: { componentName: 'ContentBlock', dataSource: '{id}', isContentResolved: false }
// → ContentBlock is not rendered; no extra app-level check is required.
@public
```
