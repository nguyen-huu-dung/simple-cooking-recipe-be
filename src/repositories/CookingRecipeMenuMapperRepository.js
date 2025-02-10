import { CookingRecipeMenuMapperModel } from '../models';
import BaseRepository from './BaseRepository';

class CookingRecipeMenuMapperRepository extends BaseRepository {

    constructor() {
        super();
        this.model = CookingRecipeMenuMapperModel;
    }
}

export default CookingRecipeMenuMapperRepository;
