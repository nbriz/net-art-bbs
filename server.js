const net = require('net')
const port = process.argv[2] || 80
const utils = require('./utils.js')
const text = require('./texts.js')
const C = require('./colors.js')
const sockets = []
const W = 59

function homePage (socket) {
  socket.chatting = false
  utils.clear(socket)
  socket.write(text.banner)
  socket.write(text.menu)
}

function journeyPage (socket) {
  socket.chatting = false
  utils.clear(socket)
  socket.write(text.menu)
  socket.write(utils.print10(W, true))
  socket.write(utils.print10(W))
  const info = text.journey(socket, W)
  socket.write(info)
  if (typeof socket.journey === 'string') {
    socket.write('\n')
    socket.write('\n' + socket.journey)
    socket.write('\n')
  } else {
    socket.write('\n')
    socket.write('\n')
    utils.mapjourney(socket)
    socket.write(utils.print10(W, true))
    socket.write(utils.print10(W, true))
    socket.write(utils.print10(W))
  }
}

function tracePage (socket) {
  socket.chatting = false
  utils.clear(socket)
  socket.write(text.menu)
  socket.write(utils.print10(W, true))
  socket.write(utils.print10(W))
  const info = text.trace(socket, W)
  socket.write(info)
  socket.write(`${C[0]}\n`)
  socket.write(utils.print10(W, true))
  socket.write(utils.print10(W, true))
  socket.write(utils.print10(W))
}

function chatRoom (socket, data) {
  socket.chatting = true
  if (!socket.handle) {
    const d = data.split('.')
    socket.handle = d.length > 1 ? d[1].toUpperCase() : 'anon'
    utils.newUser(sockets, socket)
  }
  utils.clear(socket)
  socket.write(text.menu)
  socket.write(utils.print10(W, true))
  socket.write(utils.print10(W, true))
  const s = `  WELCOME TO THE CHAT ${socket.handle}, there are ${sockets.length} users logged in`
  const welcome = utils.untrim(s, W, true)
  socket.write(welcome)
  socket.write(utils.print10(W, true))
  socket.write(utils.print10(W, true))
}

function handleData (socket, data) {
  data = data.toString()
  data = data.substr(0, data.length - 2) // clear \r\n
  if (data === '@quit') {
    socket.end()
  } else if (data === '@home') {
    homePage(socket)
  } else if (data === '@journey') {
    journeyPage(socket)
  } else if (data === '@trace') {
    tracePage(socket)
  } else if (data.indexOf('@chat') === 0) {
    chatRoom(socket, data)
  } else if (socket.handle) {
    utils.printChat(sockets, socket, data)
  }
}

function closeSocket (socket) {
  const i = sockets.indexOf(socket)
  if (i !== -1) sockets.splice(i, 1)
}

function newSocket (socket) {
  socket.handle = null
  socket.color = C[Math.floor(Math.random() * 15) + 7]

  socket.journey = '[ still running trace, wait a couple mins,\n then type/enter @journey to try again ]'
  sockets.push(socket)
  utils.geo(socket)
  utils.trace(socket, (journey) => utils.geotrace(journey))
  homePage(socket)

  socket.on('data', (data) => handleData(socket, data))
  socket.on('end', () => closeSocket(socket))
}

const server = net.createServer(newSocket)
server.listen(port, (err) => {
  if (err) return console.log(err)
  console.log(`server is listening => telnet localhost ${port}`)
})
