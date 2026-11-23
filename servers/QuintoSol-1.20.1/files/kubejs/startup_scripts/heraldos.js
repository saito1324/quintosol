// ============================================================================
//  EL QUINTO SOL - Heraldos
//  Los cuatro Heraldos de Era (fase 1).
//
//  Registro del tipo de entidad + atributos + nombre + drop.
//  La IA (metas y objetivos) va en server_scripts/heraldos.js.
//
//  Modelos: se reutilizan los .geo.json vanilla que ya trae EntityJS
//  (assets/kubejs/geo/entity/<mob>.geo.json) hasta tener modelos propios.
// ============================================================================

// La Brasa de Copal es el item de revivir del servidor (tag TotemRevivir:1b).
// Usa blaze_powder a proposito: un totem_of_undying en la mano reviviria solo
// al jugador y romperia la regla de 1 vida.
// Se construye con withNBT + withName + withLore porque el SNBT complejo
// dentro de withNBT() pierde el tag display.
function brasaDeCopal() {
    return Item.of('minecraft:blaze_powder')
        .withNBT('{TotemRevivir:1b}')
        .withName(Text.of('§6§lBrasa de Copal'))
        .withLore([
            Text.of('§7Tiralo junto a un eliminado'),
            Text.of('§7para devolverlo a la partida.')
        ])
}

StartupEvents.registry('entity_type', event => {

    // Registra un Heraldo con su configuracion. Devuelve el builder.
    function heraldo(id, cfg) {
        let builder = event.create(id, 'entityjs:mob')
            .sized(cfg.ancho, cfg.alto)
            .mobCategory('monster')
            .clientTrackingRange(10)
            .setSoundVolume(1.5)
            .canSpawnFarFromPlayer(true)        // un jefe no despawnea por distancia
            .modelResource(entity => cfg.modelo)
            .textureResource(entity => cfg.textura)
            .animationResource(entity => 'quintosol:animations/entity/' + cfg.animacion + '.animation.json')
            .scale(entity => cfg.escala)
            .attributes(attributes => {
                attributes.add('minecraft:generic.max_health', cfg.vida)
                attributes.add('minecraft:generic.attack_damage', cfg.dano)
                attributes.add('minecraft:generic.armor', cfg.armadura)
                attributes.add('minecraft:generic.movement_speed', cfg.velocidad)
                attributes.add('minecraft:generic.knockback_resistance', cfg.resistencia)
                attributes.add('minecraft:generic.follow_range', cfg.rango)
                if (cfg.empuje) {
                    attributes.add('minecraft:generic.attack_knockback', cfg.empuje)
                }
            })
            .onAddedToWorld(entity => {
                entity.setPersistenceRequired()
                entity.setCustomName(Text.of(cfg.nombre))
                entity.setCustomNameVisible(true)
            })
            .dropCustomDeathLoot(ctx => {
                ctx.entity.block.popItem(brasaDeCopal())
            })
            .addAnimationController('movimiento', 6, ev => {
                if (ev.entity.hurtTime > 0) {
                    ev.thenPlayAndHold('attack')
                } else if (ev.isMoving()) {
                    ev.thenLoop('walk')
                } else {
                    ev.thenLoop('idle')
                }
                return true
            })

        if (cfg.fuego) {
            builder = builder.fireImmune(true)
        }
        if (cfg.roboVida) {
            // Tleco se cura cuando golpea: "come brasas".
            builder = builder.onHurtTarget(ctx => ctx.entity.heal(cfg.roboVida))
        }
        return builder
    }

    // 1. Ocelotl, el sacerdote jaguar - Heraldo de Tierra (primer Heraldo).
    heraldo('quintosol:ocelotl', {
        nombre: '§6§lOcelotl§r§7, Heraldo de la Tierra',
        modelo: 'kubejs:geo/entity/ocelot.geo.json',
        textura: 'minecraft:textures/entity/cat/ocelot.png',
        animacion: 'ocelotl',
        ancho: 1.5, alto: 3.0, escala: 3.0,
        vida: 450, dano: 14, armadura: 12,
        velocidad: 0.28, resistencia: 0.7, rango: 48
    })

    // 2. Ehecatl, señor de las cumbres gélidas - Heraldo de Aire.
    //    Sus golpes empujan lejos (rafagas de viento).
    heraldo('quintosol:ehecatl', {
        nombre: '§b§lEhecatl§r§7, Heraldo del Aire',
        modelo: 'kubejs:geo/entity/phantom.geo.json',
        textura: 'minecraft:textures/entity/phantom.png',
        animacion: 'ehecatl',
        ancho: 2.0, alto: 2.6, escala: 3.0,
        vida: 520, dano: 16, armadura: 8,
        velocidad: 0.34, resistencia: 0.2, rango: 64,
        empuje: 3
    })

    // 3. Tleco, el coloso volcánico - Heraldo de Fuego.
    //    Inmune al fuego y se cura al golpear.
    heraldo('quintosol:tleco', {
        nombre: '§c§lTleco§r§7, Heraldo del Fuego',
        modelo: 'kubejs:geo/entity/blaze.geo.json',
        textura: 'minecraft:textures/entity/blaze.png',
        animacion: 'tleco',
        ancho: 1.5, alto: 3.0, escala: 1.8,
        vida: 620, dano: 18, armadura: 16,
        velocidad: 0.26, resistencia: 0.85, rango: 48,
        fuego: true, roboVida: 6
    })

    // 4. Ayotl, el titán de pizarra y Sculk - Heraldo de Sombra (último Heraldo).
    //    Lento, pesado y practicamente imposible de empujar.
    //    Modelo propio en 3D generado desde su arte (7 huesos articulados).
    heraldo('quintosol:ayotl', {
        nombre: '§8§lAyotl§r§7, Heraldo de la Sombra',
        modelo: 'quintosol:geo/entity/ayotl_boss.geo.json',
        textura: 'quintosol:textures/entity/ayotl_boss.png',
        animacion: 'ayotl_boss',
        ancho: 2.6, alto: 4.4, escala: 0.12,
        vida: 750, dano: 22, armadura: 20,
        velocidad: 0.24, resistencia: 1.0, rango: 64
    })

})
