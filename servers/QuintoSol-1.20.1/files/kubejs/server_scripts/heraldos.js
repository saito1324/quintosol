// ============================================================================
//  EL QUINTO SOL - IA de los Heraldos
//
//  Las metas (goals) de EntityJS se registran por id de entidad y viven en
//  server_scripts. Menor numero = mayor prioridad.
// ============================================================================

const $Player = Java.loadClass('net.minecraft.world.entity.player.Player')

function agregarIA(id) {

    EntityJSEvents.addGoalSelectors(id, event => {

        event.floatSwim(0)                 // no se ahoga
        event.meleeAttack(1, 1.0, true)    // persigue y golpea aunque pierda de vista
        event.leapAtTarget(2, 0.55)        // zarpazo / embestida
        event.waterAvoidingRandomStroll(5, 0.75, 0.002)
        event.lookAtEntity(6, $Player, 24.0, 1.0, true)
        event.randomLookAround(7)

    })

    EntityJSEvents.addGoals(id, event => {

        event.hurtByTarget(0, [], false, [])                             // responde a quien lo ataque
        event.nearestAttackableTarget(1, $Player, 0, true, false, null)  // caza jugadores

    })

}

agregarIA('quintosol:ocelotl')
agregarIA('quintosol:ehecatl')
agregarIA('quintosol:tleco')
agregarIA('quintosol:ayotl')
