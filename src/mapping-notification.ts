import { Address, BigDecimal, BigInt } from "@graphprotocol/graph-ts"
import { ResetPool, ResetStakingPool } from "../generated/NotificationContract/NotificationContract"
import { Pool as PoolEntity, StakingPool as StakingPoolEntity } from "../generated/schema"

const resetPool = (address: Address): void => {
  const entity = PoolEntity.load(address.toHexString())
  if (!entity) return
  entity.totalSupply = BigDecimal.zero()
  entity.depositCount = BigInt.zero()
  entity.withdrawCount = BigInt.zero()
  entity.save()
}

export function handleResetPool(event: ResetPool): void {
  resetPool(Address.fromString("0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9")) // temp
  resetPool(Address.fromString("0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9")) // temp
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
