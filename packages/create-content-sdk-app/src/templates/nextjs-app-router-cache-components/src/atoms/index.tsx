import { defineAtomsCatalog, defineAtomsRegistry } from '@sitecore-content-sdk/nextjs';

export const catalog = defineAtomsCatalog({
  components: {},
  actions: {},
});

export const registry = defineAtomsRegistry(catalog, {
  components: {},
});
