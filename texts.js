const C = require('./colors.js')
const utils = require('./utils.js')
const banner = `${C[23]}${C[9]}

            [Welcome h4x0r to the Net Art && Cultures BBS] 
                                                           
███▄    █ ▓█████▄▄▄█████▓      ▄▄▄       ██▀███  ▄▄▄█████▓ 
██ ▀█   █ ▓█   ▀▓  ██▒ ▓▒     ▒████▄    ▓██ ▒ ██▒▓  ██▒ ▓▒ 
▓██  ▀█ ██▒▒███  ▒ ▓██░ ▒░     ▒██  ▀█▄  ▓██ ░▄█ ▒▒ ▓██░ ▒░
▓██▒  ▐▌██▒▒▓█  ▄░ ▓██▓ ░      ░██▄▄▄▄██ ▒██▀▀█▄  ░ ▓██▓ ░ 
▒██░   ▓██░░▒████▒ ▒██▒ ░  ██▓  ▓█   ▓██▒░██▓ ▒██▒  ▒██▒ ░ 
░ ▒░   ▒ ▒ ░░ ▒░ ░ ▒ ░░    ▒▓▒  ▒▒   ▓▒█░░ ▒▓ ░▒▓░  ▒ ░░   
░ ░░   ░ ▒░ ░ ░  ░   ░     ░▒    ▒   ▒▒ ░  ░▒ ░ ▒░    ░    
  ░   ░ ░    ░    ░       ░     ░   ▒     ░░   ░   ░       
        ░    ░  ░          ░        ░  ░   ░               
                           ░                               `

const menu = `${C[30]}${C[7]}
___________________________________________________________
MENU       type and enter the following cammands to...     
___________________________________________________________
@quit      : exit the BBS                                  
@journey   : view network packet journey from BBS to you   
@trace     : instructions for how to trace packets yourself
@chat.user : chatroom (replace "user" with your handle)    
@home      : to return to the home screen                  
___________________________________________________________
${C[0]}`

const trace = (socket, W) => {
  W = W || 59
  const nfo = [
    `${C[30]}${C[7]}`,
    utils.untrim('In order for "packets" of data to travel across the', W),
    utils.untrim('Internet we need to know where the computers', W),
    utils.untrim('connected to the Internet are. In place of street', W),
    utils.untrim('addresses the Internet uses IP addresses. The IP', W),
    utils.untrim(`address of this BBS is: ${utils.a('207.154.218.233')}`, W),
    utils.untrim('', W),
    utils.untrim('When you\'re on a WiFi network, your router has a', W),
    utils.untrim('public IP address (assigned by your ISP) and each ', W),
    utils.untrim('computer on your WiFi network has a local IP address', W),
    utils.untrim('assigned by the router. If you were sending a letter', W),
    utils.untrim('through the post office you would write the', W),
    utils.untrim('recipient\'s name and address on the envelope so that', W),
    utils.untrim('the post office knows where to deliver it. On the', W),
    utils.untrim('Internet packets have headers (the envelope) with to', W),
    utils.untrim('and from addresses (the public IP addresses), when', W),
    utils.untrim('a packet arrives at it\'s destination, the router', W),
    utils.untrim('uses it\'s list of local IP addresses (the specific', W),
    utils.untrim('recipient at that home) to know which computer on', W),
    utils.untrim('the network it belongs to.', W),
    utils.untrim('', W),
    utils.untrim(`To see what your local IP address is run the ${utils.c('ifconfig')}`, W),
    utils.untrim('command in a new terminal and look for the address', W),
    utils.untrim('next to the word "inet", it\'s usually something', W),
    utils.untrim('like 192.168.0.1 or 172.16.0.1 or 10.0.0.1, ', W),
    utils.untrim('', W),
    utils.untrim(`Your public IP address is: ${utils.a(utils.IP(socket))}`, W),
    utils.untrim(`Which is in ${utils.a(socket.geo.city)}, ${utils.a(socket.geo.regionName)}`, W),
    utils.untrim('at approximately the following latitude, longitude:', W),
    utils.untrim(`${utils.a(socket.geo.lat)}, ${utils.a(socket.geo.lon)}`, W),
    utils.untrim('', W),
    utils.untrim('The simplest way to find your public IP address is to do a', W),
    utils.untrim('web search for "what\'s my IP address", most search engines', W),
    utils.untrim('will show you where your request is coming form, this will', W),
    utils.untrim('usually be your router\'s IP address (or the IP address of', W),
    utils.untrim('your VPN or proxy server if you\'re using one of those).', W),
    utils.untrim('', W),
    utils.untrim('There are lots of online services that will translate an IP', W),
    utils.untrim('address into a physical address (GPS coordinates), you can', W),
    utils.untrim('do a web search for "IP to GEO", to find your location I\'m', W),
    utils.untrim(`using this one: ${utils.a('https://ip-api.com/')}`, W),
    utils.untrim('', W),
    utils.untrim('To find the IP address of a website you\'re visiting you can', W),
    utils.untrim(`use the ${utils.c('nslookup')} command in the terminal, simply enter the`, W),
    utils.untrim(`name of the domain, for example ${utils.c('nslookup saic.edu')} will show`, W),
    utils.untrim('you the school\'s server\'s IP address (which you can then', W),
    utils.untrim('use to find it\'s physical location)', W),
    utils.untrim('', W),
    utils.untrim('To trace the route your packets travel from your computer', W),
    utils.untrim(`to another on the internet use the ${utils.c('traceroute')} command, for`, W),
    utils.untrim(`example ${utils.c('traceroute saic.edu')} will display a list of IP `, W),
    utils.untrim('addresses, these are the different routers/computers your', W),
    utils.untrim('packet pass through along their journey. It\'s not uncommon', W),
    utils.untrim('for your packets to take a different route every time,', W),
    utils.untrim('because they always find the quickest way (least congested)', W),
    utils.untrim('route at any given moment.', W),
    utils.untrim('', W)
  ]
  return nfo.join('\n')
}

const journey = (socket, W) => {
  W = W || 59
  const nfo = [
    `${C[30]}${C[7]}`,
    utils.untrim('The data on this page traveled across the Internet', W),
    utils.untrim('from this BBS computer to your computer. Here is an', W),
    utils.untrim('approximation of the journey that it took:', W),
    utils.untrim('', W)
  ]
  return nfo.join('\n')
}

module.exports = { banner, menu, journey, trace }
