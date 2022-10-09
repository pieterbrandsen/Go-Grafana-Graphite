Memory.stats = {
    gcl: Game.gcl,
    gpl: Game.gpl,
    cpu: {
        bucket: Game.cpu.bucket,
        usage: Game.cpu.getUsed(),
        limit: Game.cpu.limit,
    },
    resources: {
        pixels: Game.resources[PIXEL],
        cpuUnlock: Game.resources[CPU_UNLOCK],
        accessKey: Game.resources[ACCESS_KEY],
    },
    roomCount: Object.keys(Game.rooms).length,
    creepCount: Object.keys(Game.creeps).length,
    spawnCount: Object.keys(Game.spawns).length,
    constructionSiteCount: Object.keys(Game.constructionSites).length,
    flagCount: Object.keys(Game.flags).length,
    rooms: {},
}

Object.entries(Game.rooms).forEach(([name, room]) => {
    Memory.stats.rooms[name] = {
        controller: room.controller,
        energyAvailable: room.energyAvailable,
        energyCapacityAvailable: room.energyCapacityAvailable,
        energyInStorage: room.storage ? room.storage.store.energy : 0,
        energyInTerminal: room.terminal ? room.terminal.store.energy : 0,
    }
})
