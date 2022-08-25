export interface LogErrorRepository {
  log: (stack: String) => Promise<void>
}
