[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [utils](../README.md) / isServerSidePropsContext

# Function: isServerSidePropsContext()

> **isServerSidePropsContext**(`context`): `context is GetServerSidePropsContext`

Defined in: [nextjs/src/utils/utils.ts:70](https://github.com/Sitecore/content-sdk/blob/dca81790520720d9e179a738163a316f911b36d8/packages/nextjs/src/utils/utils.ts#L70)

Determines whether context is GetServerSidePropsContext (SSR) or GetStaticPropsContext (SSG)

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `context` | `GetServerSidePropsContext` \| `GetStaticPropsContext` |  |

## Returns

`context is GetServerSidePropsContext`
