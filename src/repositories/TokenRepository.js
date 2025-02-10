import { TokenModel } from '../models';
import BaseRepository from './BaseRepository';

class TokenRepository extends BaseRepository {

    constructor() {
        super();
        this.model = TokenModel;
    }
}

export default TokenRepository;
