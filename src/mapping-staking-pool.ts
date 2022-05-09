import { Address, BigDecimal, BigInt } from "@graphprotocol/graph-ts";
import { Staked, StakingPool } from "../generated/StakingPool/StakingPool"
import { StakingPool as StakingPoolEntity } from "../generated/schema"

function getStakingPool(address: Address): StakingPoolEntity {
  const entity = StakingPoolEntity.load(address.toHexString())
  if (entity) return entity
  const newEntity = new StakingPoolEntity(address.toHexString())
  const _instance = StakingPool.bind(address)
  const _token = _instance.try_token()
  newEntity.token = _token.reverted ? Address.zero() : _token.value
  const _rewardToken = _instance.try_rewardToken()
  newEntity.rewardToken = _rewardToken.reverted ? Address.zero() : _rewardToken.value
  const _totalSupply = _instance.try_totalSupply()
  newEntity.totalSupply = _totalSupply.reverted ? BigDecimal.zero() : _totalSupply.value.toBigDecimal()
  newEntity.stakeCount = BigInt.fromString("0")
  return newEntity
}

export function handleStake(event: Staked): void {
  const entity = getStakingPool(event.address)
  entity.totalSupply = entity.totalSupply.plus(event.params.amount.toBigDecimal())
  entity.stakeCount = entity.stakeCount.plus(BigInt.fromString("1"))
  entity.save()
}
