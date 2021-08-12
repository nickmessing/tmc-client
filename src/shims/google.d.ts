interface CallbackResponse {
  clientId: string
  credential: string
  select_by: string
}

interface IdConfiguration {
  client_id: string
  callback(response: CallbackResponse): void
}

declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize(config: IdConfiguration): void
          prompt(): void
        }
      }
    }
  }
}

export {}
