
const s = 'email@domain.co.uk'

const atCheck = /^[^@]+@[^@]+$/;

const edgeDotCheck = /^[^\.](.*[^\.])?$/
const doubleDotCheck = /^(\.(?!\.)|[^\.])*$/
const domainDotCheck = /.+\..+/



function emailCheckAt(email) {
  const regex = atCheck
  return regex.test(email)
}

function emailEdgeDotsCheck(email) {
  const regex = edgeDotCheck
  return regex.test(email)
}

function emailDoubleDotCheck(email) {
  const regex = doubleDotCheck
  return regex.test(email)
}

function emailDomainDotCheck(email) {
  const regex = domainDotCheck
  return regex.test(email)
}

const [local, domain] = s.split("@")
console.log(local, domain)

