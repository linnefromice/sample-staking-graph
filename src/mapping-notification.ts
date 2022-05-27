import { Address, BigDecimal, BigInt } from "@graphprotocol/graph-ts"
import { ResetPool, ResetStakingPool } from "../generated/NotificationContract/NotificationContract"
import { StakingPool as StakingPoolEntity } from "../generated/schema"

export function handleResetPool(event: ResetPool): void {
  // TODO
}

export function handleResetStakingPool(event: ResetStakingPool): void {
  const address = Address.fromString("0x0165878A594ca255338adfa4d48449f69242Eb8F") // temp
  const entity = StakingPoolEntity.load(address.toHexString())
  if (!entity) return
  entity.totalSupply = BigDecimal.zero()
  entity.stakeCount = BigInt.zero()
  entity.unstakeCount = BigInt.zero()
  entity.save()
}
