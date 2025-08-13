
function validatePassword(password) {
  const allowedLength = 8;
  function passwordLengthCheck() {
    console.log("length check:", password.length >= allowedLength)
    return password.length >= allowedLength;
  }
  function passwordNumOnlyCheck() {
    const passwordArray = password.split("")
    const allNum = passwordArray.every(s => /\d/.test(s)
    );
    console.log("num check:", !allNum)
    return !allNum
  }
  // TODO add user data similarity check and common passwords check

  const isValid = passwordLengthCheck() && passwordNumOnlyCheck();
  console.log(password, isValid);
  return isValid;
}

const pwd1 = "120975193";
const pwd2 = "12312dwqwqd12312";
const pwd3 = "wejogwoedkmc()*&^%%ERFGU(*&*R%TG";
const pwd4 = "we3r";

const pwds = [pwd1, pwd2, pwd3, pwd4];

pwds.forEach((p) => validatePassword(p));
