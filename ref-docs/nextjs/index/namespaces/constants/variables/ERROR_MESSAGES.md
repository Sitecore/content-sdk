[**@sitecore-content-sdk/nextjs**](../../../../README.md)

***

[@sitecore-content-sdk/nextjs](../../../../README.md) / [index](../../../README.md) / [constants](../README.md) / ERROR\_MESSAGES

# Variable: ERROR\_MESSAGES

> `const` **ERROR\_MESSAGES**: `object`

Defined in: core/types/constants.d.ts:37

**`Internal`**

The error messages. Includes errors for all packages.

## Type Declaration

### CONTACT\_SUPPORT

> `readonly` **CONTACT\_SUPPORT**: `"If the issue persists, please contact Sitecore Support."`

Generic follow-up when the user should contact support

### IE\_001

> `readonly` **IE\_001**: (`pluginName`, `dependency`) => `string`

IE errors are related to incorrect execution

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `pluginName` | `string` |
| `dependency` | `string` |

#### Returns

`string`

### IE\_002

> `readonly` **IE\_002**: "\[IE-002\] SDK not initialized. You must first initialize the SDK using \"initContentSdk()\"."

### IE\_003

> `readonly` **IE\_003**: `"[IE-003] Timeout exceeded. The server did not respond within the allotted time."`

### IE\_004

> `readonly` **IE\_004**: (`pluginName`) => `string`

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `pluginName` | `string` |

#### Returns

`string`

### IE\_005

> `readonly` **IE\_005**: "\[IE-005\] Unable to set the \"sc\_cid\" cookie because the client ID could not be retrieved from the server. Make sure to set the correct values for \"contextId\" and \"siteName\". If the issue persists, try again later or use try-catch blocks to handle this error."

### IE\_006

> `readonly` **IE\_006**: "\[IE-006\] Unable to set the \"sc\_cid\_personalize\" cookie because the visitor ID could not be retrieved from the server. Make sure to set the correct values for \"contextId\" and \"siteName\". If the issue persists, try again later or use try-catch blocks to handle this error."

### IE\_007

> `readonly` **IE\_007**: (`hostName`) => `string`

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `hostName` | `string` |

#### Returns

`string`

### IE\_008

> `readonly` **IE\_008**: `"[IE-008] Lock file validation failed:"`

### IE\_009

> `readonly` **IE\_009**: `` "[IE-009] Atom validation failed. See issues above. You see this error because `breakOnError` is enabled in your CLI config." ``

### IV\_001

> `readonly` **IV\_001**: "\[IV-001\] Incorrect value for \"edgeUrl\". Set the value to a valid URL."

IV errors are related to incorrect values, wrongly formatted objects, etc.

### IV\_002

> `readonly` **IV\_002**: "\[IV-002\] Incorrect value for \"timeout\". Set the value to an integer greater than or equal to 0."

### IV\_003

> `readonly` **IV\_003**: "\[IV-003\] Incorrect value for \"dob\". Format the value according to ISO 8601."

### IV\_004

> `readonly` **IV\_004**: "\[IV-004\] Incorrect value for \"email\". Set the value to a valid email address."

### IV\_005

> `readonly` **IV\_005**: "\[IV-005\] Incorrect value for \"expiryDate\". Format the value according to ISO 8601."

### IV\_006

> `readonly` **IV\_006**: (`maxAttributes`) => `string`

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `maxAttributes` | `number` |

#### Returns

`string`

### IV\_007

> `readonly` **IV\_007**: (`siteName`) => `string`

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `siteName` | `string` |

#### Returns

`string`

### IV\_008

> `readonly` **IV\_008**: (`lockSide`, `currentSide`) => `string`

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `lockSide` | `string` |
| `currentSide` | `string` |

#### Returns

`string`

### IV\_009

> `readonly` **IV\_009**: (`name`, `lockSide`, `currentSide`) => `string`

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `name` | `string` |
| `lockSide` | `string` |
| `currentSide` | `string` |

#### Returns

`string`

### IV\_010

> `readonly` **IV\_010**: (`name`) => `string`

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `name` | `string` |

#### Returns

`string`

### MV\_001

> `readonly` **MV\_001**: "\[MV-001\] \"contextId\" is required."

MV errors are related to missing values

### MV\_002

> `readonly` **MV\_002**: "\[MV-002\] \"siteName\" is required."

### MV\_003

> `readonly` **MV\_003**: "\[MV-003\] \"identifiers\" is required."

### MV\_004

> `readonly` **MV\_004**: "\[MV-004\] \"friendlyId\" is required."

### MV\_005

> `readonly` **MV\_005**: (`property`) => `string`

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `property` | `string` |

#### Returns

`string`

### MV\_006

> `readonly` **MV\_006**: "\[MV-006\] \"clientContextId\" is missing. Client-side functionalities may be limited."

### MV\_007

> `readonly` **MV\_007**: "\[MV-007\] Provide either \"contextId\" or both \"apiHost\" and \"apiKey\"."

### MV\_008

> `readonly` **MV\_008**: `"[MV-008] Verify that sitecore.config is properly imported and correctly referenced."`

### MV\_009

> `readonly` **MV\_009**: "\[MV-009\] \"language\" is required."

### MV\_010

> `readonly` **MV\_010**: (`modulePath`) => `string`

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `modulePath` | `string` |

#### Returns

`string`

### MV\_011

> `readonly` **MV\_011**: (`modulePath`) => `string`

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `modulePath` | `string` |

#### Returns

`string`

### MV\_012

> `readonly` **MV\_012**: `` "[MV-012] Lock file not found. Run `sitecore-tools project atoms update` to generate it." ``

### MV\_013

> `readonly` **MV\_013**: (`name`) => `string`

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `name` | `string` |

#### Returns

`string`

### MV\_014

> `readonly` **MV\_014**: (`name`) => `string`

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `name` | `string` |

#### Returns

`string`
