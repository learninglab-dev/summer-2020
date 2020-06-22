
const obj = {
  blue: true,
  orange: false
}

if (!obj.green?.test) {
  const element = document.getElementById('babel-test')
  element.textContent = 'green'
}
