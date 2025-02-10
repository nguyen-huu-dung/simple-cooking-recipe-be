import { UserModel } from '../models';
import BaseRepository from './BaseRepository';

class UserRepository extends BaseRepository {

    constructor() {
        super();
        this.model = UserModel;
    }
}

export default UserRepository;
