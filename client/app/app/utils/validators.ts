class Validator {
	validateEmail(email: string): boolean {
		const atCheck = /^[^@]+@[^@]+$/;
		const edgeDotCheck = /^[^\.](.*[^\.])?$/;
		const doubleDotCheck = /^(\.(?!\.)|[^\.])*$/;
		const domainDotCheck = /.+\..+/;

		function emailCheckAt(email: string) {
			const regex = atCheck;
			return regex.test(email);
		}

		function emailEdgeDotsCheck(emailPart: string) {
			const regex = edgeDotCheck;
			return regex.test(emailPart);
		}

		function emailDoubleDotCheck(emailPart: string) {
			const regex = doubleDotCheck;
			return regex.test(emailPart);
		}

		function emailDomainDotCheck(domain: string) {
			const regex = domainDotCheck;
			return regex.test(domain);
		}
		if (emailCheckAt(email)) {
			const [local, domain] = email.split("@");
			const is_valid =
				emailDoubleDotCheck(local) &&
				emailDoubleDotCheck(domain) &&
				emailEdgeDotsCheck(local) &&
				emailEdgeDotsCheck(domain) &&
				emailDomainDotCheck(domain);

			console.log("Email " + email + " | --> valid: " + String(is_valid));
			return is_valid;
		} else {
			console.log("Email " + email + " | --> valid: " + " false");
			return false;
		}
	}
	validatePassword(password: string) {
		const allowedLength = 4;
		function passwordLengthCheck() {
			return password.length >= allowedLength;
		}
		function passwordNumOnlyCheck() {
			const passwordArray = password.split("");
			const allNum = passwordArray.every((s) => /\d/.test(s));
			return !allNum;
		}
		// TODO add user data similarity check and common passwords check

		const isValid = passwordLengthCheck() && passwordNumOnlyCheck();
		return isValid;
	}
}

const validator = new Validator();
export default validator;
