import { defineAtomsCatalog, defineAtomsRegistry } from '@sitecore-content-sdk/nextjs/atoms';

export const catalog = defineAtomsCatalog({
  components: {},
  actions: {},
});

export const registry = defineAtomsRegistry(catalog, {
  components: {},
});
