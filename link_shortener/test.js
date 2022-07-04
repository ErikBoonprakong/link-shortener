function randomFour() {
  const characters = ['a', 'e', 'r', 'i', 'k', 'o', 'u', '1', '5', '8']
  let i = 0
  let str = ''
  while (i < 4) {
    str += characters[Math.floor(Math.random() * characters.length)]
    i++
  }
  console.log(str)
  return str
}

randomFour()
