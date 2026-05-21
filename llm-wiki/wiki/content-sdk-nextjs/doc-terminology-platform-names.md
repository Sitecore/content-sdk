# Platform naming (SAI / XM Cloud / XMC)

In official docs, URLs, and template comments you will see **Sitecore AI**, **SitecoreAI**, **SAI**, **XM Cloud**, **Sitecore XM Cloud**, and **XMC**. For Content SDK work in **this monorepo**, treat them as the **same hosted platform context** unless code explicitly branches on a label.

## Practical guidance

- Do not treat mixed labels as conflicting products when reading issues, PRs, or wiki notes.
- Template `sitecore.config` comments may use **XMC**-style URLs while SAI doc URLs use `/sai/` — same product family for this wiki.

## See also

- [overview-content-sdk.md](overview-content-sdk.md)
- [doc-sitecore-config.md](doc-sitecore-config.md) — example of mixed URL prefixes in comments vs docs
