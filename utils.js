const exec = require('child_process').exec
const C = require('./colors.js')

function print10 (length, br) {
  const a = '╲╱'
  let str = ''
  for (let i = 0; i < length; i++) {
    str += Math.random() > 0.5 ? a[0] : a[1]
  }
  return br ? str + '\n' : str
}

function untrim (str, length, br) {
  const spaces = length - str.length
  if (spaces > 0) {
    for (let i = 0; i < spaces; i++) {
      str += ' '
    }
  }
  return br ? str + '\n' : str
}

function clear (socket) {
  socket.write('\x1Bc')
}

function a (str) {
  return `${C[23]}${C[9]}${str}${C[30]}${C[7]}`
}

function c (str) {
  return `${C[23]}${C[14]}${str}${C[30]}${C[7]}`
}

function printChat (sockets, socket, data) {
  for (let i = 0; i < sockets.length; i++) {
    if (sockets[i] !== socket && sockets[i].chatting) {
      const label = `${socket.color}[${socket.handle}]\x1b[0m`
      sockets[i].write(`${label}: ${data}\r\n`)
    }
  }
}

function newUser (sockets, socket) {
  const admin = {
    handle: 'ADMIN',
    color: '\x1b[92m'
  }
  const data = `"${socket.handle}" entered the chatroom`
  printChat(sockets, admin, data)
}

function IP (socket) {
  return socket.remoteAddress.split('ff:')[1]
}

function geo (socket, callback) {
  exec(`curl http://ip-api.com/json/${IP(socket)}`, (err, stdout) => {
    if (err) socket.geo = '[ CURL FAIL :( ]'
    else socket.geo = JSON.parse(stdout)
    if (callback) callback(socket.geo)
  })
}

function trace (socket, callback) {
  const journey = []
  exec(`traceroute ${IP(socket)}`, (err, stdout) => {
    if (err) socket.journey = '[ FAIL :( ]'
    else {
      const j = stdout.split('\n')
      for (let i = 0; i < j.length; i++) {
        const arr = j[i].split('(')
        if (arr.length > 1) journey[i] = { ip: arr[1].split(')')[0] }
        else journey[i] = { ip: '[???.???.???.???]' }
      }
      socket.journey = journey
      if (callback) callback(socket.journey)
    }
  })
}

function geotrace (journey) {
  for (const hop in journey) {
    exec(`curl http://ip-api.com/json/${journey[hop].ip}`, (err, stdout) => {
      if (err) journey[hop].geo = '[?]'
      else journey[hop].geo = JSON.parse(stdout)
    })
  }
}

function mapjourney (socket) {
  const bbs = `207.154.218.233
:: gps :: 50.1188, 8.6843 (Frankfurt am Main, Germany)`
  socket.write(bbs + '\n')
  let last = null
  for (const hop in socket.journey) {
    const d = socket.journey[hop]
    let str
    if (d.ip === '[???.???.???.???]') {
      str = d.ip
    } else {
      str = d.ip + '\n'
      if (d.geo) str += `:: gps :: ${d.geo.lat}, ${d.geo.lon} (${d.geo.city}, ${d.geo.country})`
      else str += ':: gps :: ???'
    }
    if (!last) last = str
    else {
      socket.write(str + '\n')
      socket.write('\n')
    }
  }
  socket.write(last + '\n')
  socket.write(`${C[0]}\n`)
}

module.exports = {
  print10, untrim, printChat, newUser, clear, a, c, geo, trace, geotrace, IP, mapjourney
}
