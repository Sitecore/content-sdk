// Change type to human-readable header mapping
const changeTypeHeaders = {
  major: '### 💥 Breaking Changes',
  minor: '### ✨ Features',
  patch: '### 🐛 Bug Fixes',
};

module.exports = {
  changelog: {
    /**
     * Renders individual changelog entries with commit links
     */
    renderEntry: (entry) => {
      if (!entry || typeof entry !== 'object') {
        return '';
      }

      const comment = entry.comment;

      // Skip entries without comments
      if (!comment) {
        return '';
      }

      // Skip auto-generated "Bump X to vY" dependency update messages
      if (comment.startsWith('Bump ')) {
        return '';
      }

      // Only include commit link if we have a valid commit hash (40 char hex)
      let commitLink = '';
      if (entry.commit && /^[a-f0-9]{40}$/i.test(entry.commit)) {
        commitLink = ` ([${entry.commit.substring(
          0,
          7
        )}](https://github.com/sitecore/content-sdk/commit/${entry.commit}))`;
      }

      return `- ${comment}${commitLink}`;
    },

    /**
     * Renders the version header with version number and date
     */
    renderHeader: (entry) => {
      let version = '';
      let dateStr = new Date().toISOString().split('T')[0];

      if (typeof entry === 'string') {
        version = entry;
      } else if (entry && typeof entry === 'object') {
        version = entry.version || entry.name || entry.tag || '';
        if (entry.date) {
          dateStr = new Date(entry.date).toISOString().split('T')[0];
        }
      }

      // If no version, return empty to avoid rendering "## " headers
      if (!version) {
        return '';
      }

      return `## ${version}\n\n_${dateStr}_\n`;
    },

    /**
     * Renders change type section headers
     */
    renderChangeTypeHeader: (changeType) => {
      return changeTypeHeaders[changeType] || '';
    },
  },
};
