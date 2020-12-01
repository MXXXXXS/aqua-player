import { join } from 'path'
export default (relativeToWorkspace: string): string => {
  return join(__dirname, '../..', relativeToWorkspace)
}
