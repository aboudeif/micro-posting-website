class Validators {
    static isEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    static isNotEmpty(value) {
        return value && value.trim().length > 0;
    }

    static minLength(value, min) {
        return value && value.length >= min;
    }
}
