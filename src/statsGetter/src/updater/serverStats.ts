/* eslint-disable @typescript-eslint/restrict-plus-operands */
import winston from 'winston'

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'logs/sync.log' }),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
})

function objectFilter (obj: any, predicate: any): any {
  return (
    Object.keys(obj)
      .filter((key) => predicate(obj[key]))
      // eslint-disable-next-line
      .reduce((res:any, key) => ((res[key] = obj[key]), res), {})
  )
}

function groupObjectByKey (object: any, key: any): any {
  return Object.entries(object).reduce((hash: any, obj: any) => {
    if (obj[1][key] === undefined) return hash
    // return Object.assign(hash, { [obj[1][key]]: (hash[obj[1][key]] || {}).concat(obj) })
    if (hash[obj[1][key]] === undefined) {
      hash[obj[1][key]] = {}
    }
    return Object.assign(hash, {
      [obj[1][key]]: Object.assign(hash[obj[1][key]], { [obj[0]]: obj[1] })
    })
  }, {})
}

function HandleRoomStats (stats: any, objects: any): any {
  stats.structureCounts = {
    spawn: 0,
    extension: 0,
    wall: 0,
    rampart: 0,
    link: 0,
    storage: 0,
    tower: 0,
    observer: 0,
    power_spawn: 0,
    extractor: 0,
    lab: 0,
    terminal: 0,
    container: 0,
    nuker: 0,
    factory: 0
  }
  stats.creepCounts = 0
  stats.droppedEnergy = 0
  stats.creepBodies = {
    move: 0,
    work: 0,
    carry: 0,
    attack: 0,
    ranged_attack: 0,
    tough: 0,
    heal: 0,
    claim: 0
  }
  const stores = {
    energy: 0
  }
  stats.creepStore = { ...stores }
  stats.tombstoneStore = { ...stores }
  stats.structureStore = {}
  const structureKeys = Object.keys(stats.structureCounts)
  structureKeys.forEach((type) => {
    stats.structureStore[type] = { ...stores }
  })
  stats.constructionSites = {
    count: 0,
    progress: 0,
    total: 0
  }
  stats.controller = {
    level: 0,
    progress: 0,
    progressTotal: 0
  }
  stats.mineralAmount = 0

  for (let i = 0; i < objects.length; i += 1) {
    const object = objects[i]
    if (structureKeys.includes(object.type)) {
      stats.structureCounts[object.type] += 1
      Object.entries(object.store).forEach(([resource, count]) => {
        const structureStores = stats.structureStore[object.type]
        if (structureStores[resource] !== undefined) {
          structureStores[resource] += count
        }
      })
    }
    switch (object.type) {
      case 'creep':
        stats.creepCounts += 1
        Object.entries(object.body).forEach(([part, count]) => {
          stats.creepBodies[part] += count
        })
        Object.entries(object.store).forEach(([resource, count]) => {
          if (stats.creepStore[resource] !== undefined) { stats.creepStore[resource] += count }
        })
        break
      case 'energy':
        stats.droppedEnergy += object.energy
        break
      case 'constructionSite':
        stats.constructionSites.count += 1
        stats.constructionSites.progress += object.progress
        stats.constructionSites.total += object.progressTotal
        break
      default:
        break
    }
  }
  return stats
}
function HandleOwnedRoomStats (stats: any, objects: any): any {
  for (let i = 0; i < objects.length; i += 1) {
    const object = objects[i]
    switch (object.type) {
      case 'controller':
        stats.controller = {
          level: object.level,
          progress: object.progress,
          progressTotal: object.progressTotal
        }
        break
      case 'mineral':
        stats.mineralAmount = object.mineralAmount
        break
      default:
        break
    }
  }
  return stats
}
function HandleReservedRoomStats (stats: any): any {
  return stats
}

function handleServerStats (users: any, roomsObjects: any): any {
  const stats: any = {}
  const ownedControllers = objectFilter(
    roomsObjects,
    (c: any) => c.type === 'controller' && c.user
  )
  const reservedControllers = objectFilter(
    roomsObjects,
    (c: any) => c.type === 'controller' && c.reservation
  )

  for (let i = 0; i < users.length; i += 1) {
    const user: any = users[i]
    const ownedRoomNames = Object.values(
      objectFilter(ownedControllers, (c: any) => c.user === user._id)
    ).map((c: any) => c.room)
    const reservedRoomNames = Object.values(
      objectFilter(reservedControllers, (c: any) => c.reservation.user === user._id)
    ).map((c: any) => c.room)

    const ownedObjects = objectFilter(roomsObjects, (o: any) =>
      ownedRoomNames.includes(o.room)
    )
    const reservedObjects = objectFilter(roomsObjects, (o: any) =>
      reservedRoomNames.includes(o.room)
    )

    const groupedOwnedObjects = groupObjectByKey(ownedObjects, 'room')
    const groupedReservedObjects = groupObjectByKey(reservedObjects, 'room')

    const ownedRooms: any = {}
    Object.entries(groupedOwnedObjects).forEach(([room, objects]: any) => {
      const objectsValues = Object.values(objects)
      let roomStats = {}
      roomStats = HandleRoomStats(roomStats, objectsValues)
      roomStats = HandleOwnedRoomStats(roomStats, objectsValues)
      ownedRooms[room] = roomStats
    })
    Object.entries(groupedReservedObjects).forEach(([room, objects]: any) => {
      let roomStats = {}
      roomStats = HandleRoomStats(roomStats, objects)
      roomStats = HandleReservedRoomStats(roomStats)
      ownedRooms[room] = roomStats
    })
    const reservedRooms = {}

    stats[user.username] = {
      user,
      owned: ownedRooms,
      reserved: reservedRooms
    }
  }

  if (Object.keys(stats).length === 0) {
    return undefined
  }
  return stats
};

function modifyRoomObjects (roomObjects: StringMap<any>): any {
  const updatedObjects: StringMap<any> = {}
  roomObjects.forEach((obj: any) => {
    updatedObjects[obj._id] = obj
    const object: any = updatedObjects[obj._id]

    switch (object.type) {
      case 'controller':
        if (!object.user) return
        switch (object.level) {
          case 1:
            object.progressTotal = 200
            break
          case 2:
            object.progressTotal = 45000
            break
          case 3:
            object.progressTotal = 135000
            break
          case 4:
            object.progressTotal = 405000
            break
          case 5:
            object.progressTotal = 1215000
            break
          case 6:
            object.progressTotal = 3645000
            break
          case 7:
            object.progressTotal = 10935000
            break
          default:
            object.progressTotal = 0
            break
        }
        break
      case 'creep': {
        const countPerType: StringMap<number> = {}
        if (!object.body) return
        const body = object.body.map((p: any) => p.type)
        for (let p = 0; p < body.length; p += 1) {
          const part = body[p]
          if (countPerType[part] === undefined) countPerType[part] = 0
          countPerType[part] += 1
        }

        object.body = countPerType
        break
      }
      default:
        break
    }
  })

  return updatedObjects
}

export default function ConvertServerStats (unfilteredUsers: any, unfilteredRoomObjects: any): any {
  if (unfilteredUsers === undefined || unfilteredRoomObjects === undefined) return
  try {
    const unfilteredActiveUsers = unfilteredUsers.filter((u: any) => u.active === 10000)
    const modifiedRoomsObjects = modifyRoomObjects(unfilteredRoomObjects)
    return handleServerStats(unfilteredActiveUsers, modifiedRoomsObjects)
  } catch (error) {
    logger.error(error)
    return undefined
  }
}
