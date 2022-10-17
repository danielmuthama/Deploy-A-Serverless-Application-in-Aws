import { JwksError } from "jwks-rsa";
import Axios from 'axios'
import { createLogger } from '../utils/logger';

const logger = createLogger('JWKs')

export class JwksClient {
    url: string;
    constructor(url: string) {
        this.url = url;
    }

    async getJwks() {
        try {
            logger.info('Fetching...')
            return await (await Axios.get(this.url)).data.keys;
        } catch (error) {
            logger.error(error)
            return new JwksError(error);
        }
    }

    async getSigningKeys(keys) {
        if (!keys || !keys.length) {
            return new JwksError('Endpoint did not contain any keys');
        }

        const signingKeys = keys
        .filter(key => key.use === 'sig'
                    && key.kty === 'RSA'
                    && key.kid 
                    && ((key.x5c && key.x5c.length) || (key.n && key.e))
        ).map(key => {
          return { kid: key.kid, nbf: key.nbf, publicKey: key.x5c[0] };
        });

        if (!signingKeys.length) {
            logger.error('Endpoint did not contain any signature verification keys')
            return new JwksError('Endpoint did not contain any signature verification keys');
          }
    }
}