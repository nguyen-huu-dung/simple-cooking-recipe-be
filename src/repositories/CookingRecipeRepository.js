import { CookingRecipeModel } from '../models';
import BaseRepository from './BaseRepository';

class CookingRecipeRepository extends BaseRepository {

    constructor() {
        super();
        this.model = CookingRecipeModel;
    }
}

export default CookingRecipeRepository;
