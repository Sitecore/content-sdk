module.exports = {
  changelog: {
    renderEntry: (entry) => {
      // Handle cases where entry might not be the expected format
      if (!entry || typeof entry !== 'object') {
        return '';
      }

      // Check if this is a valid changelog entry (has package or comment)
      // Beachball might pass dependency update objects or other metadata
      const hasPackage = entry.package || entry.packageName;
      const hasComment = entry.comment;

      // If it doesn't have the expected structure, return empty string
      // This prevents [object Object] from appearing in changelogs
      if (!hasPackage && !hasComment) {
        // Check if it's a dependency update object (has name and version)
        if (entry.name && entry.version) {
          // This is likely a dependency update - return empty to let beachball handle it
          return '';
        }
        // Unknown object structure - return empty to prevent [object Object]
        return '';
      }

      // Include commit link: short hash (7 chars) linking to full commit on GitHub
      const commitLink = entry.commit
        ? ` ([${entry.commit.substring(0, 7)}](https://github.com/sitecore/content-sdk/commit/${
            entry.commit
          }))`
        : '';

      // Use packageName if package is not available (for compatibility)
      const packageName = entry.package || entry.packageName || 'unknown';
      const comment = entry.comment || '';

      return `[${packageName}] ${comment}${commitLink}`;
    },
    renderHeader: (header) => {
      return header;
    },
    renderChangeTypeHeader: (changeType, heading) => {
      return heading;
    },
  },
};
