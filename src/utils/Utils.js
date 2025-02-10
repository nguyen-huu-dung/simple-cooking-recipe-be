class Utils {

    maskEmail(email, visibleChars = 2) {
        if (!email || !(email instanceof String || typeof email === 'string')) return '';
        const [localPart, domain] = email.split('@');
        if (!localPart || !domain) return email;
        if (localPart.length <= visibleChars) return `***@${domain}`;

        return `${localPart.slice(0, visibleChars)}${'*'.repeat(localPart.length - visibleChars)}@${domain}`;
    }
}

export default Utils;
