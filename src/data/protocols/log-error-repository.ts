export interface LogErrorRepository {
  logError: (stack: String) => Promise<void>
}
