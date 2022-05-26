import { Address, BigDecimal, BigInt, ipfs, json } from "@graphprotocol/graph-ts";
import { Deposited, Pool } from "../generated/Pool/Pool"
import { Pool as PoolEntity, Price as PriceEntity } from "../generated/schema"

const HASH = "QmUDic6ocMVUm1yTA3ogic8CUvehg4PuxXhuVuSBWQW8i6"

function getPool(address: Address): PoolEntity {
  const entity = PoolEntity.load(address.toHexString())
  if (entity) return entity
  const newEntity = new PoolEntity(address.toHexString())
  const _instance = Pool.bind(address)
  const _token = _instance.try_token()
  newEntity.token = _token.reverted ? Address.zero() : _token.value
  const _rewardToken = _instance.try_rewardToken()
  newEntity.rewardToken = _rewardToken.reverted ? Address.zero() : _rewardToken.value
  const _totalSupply = _instance.try_totalSupply()
  newEntity.totalSupply = _totalSupply.reverted ? BigDecimal.zero() : _totalSupply.value.toBigDecimal()
  newEntity.depositCount = BigInt.fromString("0")
  return newEntity
}

function getPrice(timestamp: BigInt): void {
  let entity = PriceEntity.load("prices")
  if (!entity) {
    entity = new PriceEntity("prices")
  }
  const data = ipfs.cat(HASH)
  if (data) {
    const _json = json.fromBytes(data)
    console.log(_json.toString())
    const _price = _json.toObject().get("MUUU")
    entity.priceInUsd = _price ? _price.toBigInt().toBigDecimal() : BigDecimal.zero()
    entity.updatedAt = timestamp
    entity.save()
  } else {
    console.log("Cannot get data from ipfs")
  }
}

export function handleDeposit(event: Deposited): void {
  const entity = getPool(event.address)
  entity.totalSupply = entity.totalSupply.plus(event.params.amount.toBigDecimal())
  entity.depositCount = entity.depositCount.plus(BigInt.fromString("1"))
  entity.save()
  // update price
  getPrice(event.block.timestamp)
}
