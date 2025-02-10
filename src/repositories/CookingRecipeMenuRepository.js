import { CookingRecipeMenuModel } from '../models';
import BaseRepository from './BaseRepository';

class CookingRecipeMenuRepository extends BaseRepository {

    constructor() {
        super();
        this.model = CookingRecipeMenuModel;
    }
}

export default CookingRecipeMenuRepository;
