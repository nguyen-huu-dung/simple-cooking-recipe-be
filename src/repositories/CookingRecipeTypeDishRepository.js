import { CookingRecipeTypeDishModel } from '../models';
import BaseRepository from './BaseRepository';

class CookingRecipeTypeDishRepository extends BaseRepository {

    constructor() {
        super();
        this.model = CookingRecipeTypeDishModel;
    }
}

export default CookingRecipeTypeDishRepository;
