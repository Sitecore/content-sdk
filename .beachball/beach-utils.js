export const changelog = {
  renderEntry: (entry) => {
    return `[${entry.package}] ${entry.comment}`;
  },
};
