// El Quinto Sol: al salir del servidor, cerrar Minecraft y volver al launcher.

let qsConectado = false
let qsCerrando = false

ClientEvents.loggedIn(event => {
    qsConectado = true
    console.log('[El Quinto Sol] Sesion iniciada')
})

ClientEvents.loggedOut(event => {
    console.log('[El Quinto Sol] loggedOut (conectado=' + qsConectado + ')')
    if (!qsConectado || qsCerrando) return
    qsCerrando = true
    console.log('[El Quinto Sol] Saliste del servidor. Volviendo al launcher...')
    Client.stop()
})
