import { JwtPayload } from './JwtPayload'
import { JwtHeader } from '../../node_modules/jsonwebtoken'

/**
 * Interface representing a JWT token
 */
export interface Jwt {
  header: JwtHeader
  payload: JwtPayload
}
