import { CookingRecipeMakeWayModel } from '../models';
import BaseRepository from './BaseRepository';

class CookingRecipeMakeWayRepository extends BaseRepository {

    constructor() {
        super();
        this.model = CookingRecipeMakeWayModel;
    }
}

export default CookingRecipeMakeWayRepository;
