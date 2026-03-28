module.exports = {
  extends: ['@commitlint/config-conventional'],
  helpUrl: 'https://www.conventionalcommits.org/en/v1.0.0/',
  ignores: [
    (message = '') =>
      message.startsWith('Bump ') &&
      message.includes('updated-dependencies:') &&
      message.includes('dependabot[bot]')
  ]
};
