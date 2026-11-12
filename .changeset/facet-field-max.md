---
'@sitecore-content-sdk/search': patch
---

Add the optional `max` property to `FacetField` to limit the number of values returned for a facet. Valid values are integers from 1 through 100; when omitted, the Search Runtime default of 10 is used. The value is sent as `facet.fields[].max` in the `SearchService.search()` request.
