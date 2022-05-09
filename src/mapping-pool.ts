import { Address, BigDecimal, BigInt } from "@graphprotocol/graph-ts";
import { Deposited, Pool } from "../generated/Pool/Pool"
import { Pool as PoolEntity } from "../generated/schema"

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

export function handleDeposit(event: Deposited): void {
  const entity = getPool(event.address)
  entity.totalSupply = entity.totalSupply.plus(event.params.amount.toBigDecimal())
  entity.depositCount = entity.depositCount.plus(BigInt.fromString("1"))
  entity.save()
}
