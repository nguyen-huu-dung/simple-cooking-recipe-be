class Regex {

    EMAIL = /^(?=[\s\S]{1,320}$)([a-zA-Z0-9._%+-]{1,64})@([a-zA-Z0-9.-]{1,255})\.[a-zA-Z]{2,}$/;

    ONLY_NUMBER = /^\d+$/;
}

export default new Regex();
