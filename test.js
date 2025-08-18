export const data = {
  settings: {
    notifications: {
      email: true,
      sms: false,
      push: {
        android: false,
        ios: true,
      },
    },
    privacy: {
      location: false,
      camera: true,
      microphone: false,
    },
    security: {
      twoFactorAuth: false,
      backupCodes: true,
    },
  },
  preferences: {
    theme: {
      darkMode: false,
      highContrast: false,
    },
    language: {
      english: true,
      spanish: false,
      nested: {
        regionalDialects: {
          catalan: true,
          quechua: false,
        },
      },
    },
  },
  integrations: {
    slack: false,
    github: {
      issues: true,
      pullRequests: false,
    },
    jira: {
      basic: false,
      advanced: {
        workflows: true,
        automations: false,
      },
    },
  },
};
