import {
  OwnershipTransferred as OwnershipTransferredEvent,
  _Accept as _AcceptEvent,
  _Bid as _BidEvent,
  _Buy as _BuyEvent,
  _CancelBid as _CancelBidEvent,
  _CancelFixedSale as _CancelFixedSaleEvent,
  _Claim as _ClaimEvent,
  _CreateAuction as _CreateAuctionEvent,
  _CreateFixedSale as _CreateFixedSaleEvent,
  _DeleteMarketItem as _DeleteMarketItemEvent
} from "../generated/Marketplace/Marketplace"
import {
  OwnershipTransferred,
  _Accept,
  _Bid,
  _Buy,
  _CancelBid,
  _CancelFixedSale,
  _Claim,
  _CreateAuction,
  _CreateFixedSale,
  _DeleteMarketItem
} from "../generated/schema"

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {
  let entity = new OwnershipTransferred(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.previousOwner = event.params.previousOwner
  entity.newOwner = event.params.newOwner

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handle_Accept(event: _AcceptEvent): void {
  let entity = new _Accept(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity._auctionId = event.params._auctionId
  entity.owner = event.params.owner

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handle_Bid(event: _BidEvent): void {
  let entity = new _Bid(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity._auctionId = event.params._auctionId
  entity.bidder = event.params.bidder
  entity.bidAmount = event.params.bidAmount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handle_Buy(event: _BuyEvent): void {
  let entity = new _Buy(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity._auctionId = event.params._auctionId
  entity.buyer = event.params.buyer

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handle_CancelBid(event: _CancelBidEvent): void {
  let entity = new _CancelBid(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity._auctionId = event.params._auctionId
  entity.bidder = event.params.bidder

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handle_CancelFixedSale(event: _CancelFixedSaleEvent): void {
  let entity = new _CancelFixedSale(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity._auctionId = event.params._auctionId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handle_Claim(event: _ClaimEvent): void {
  let entity = new _Claim(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity._auctionid = event.params._auctionid
  entity.tokenId = event.params.tokenId
  entity.owner = event.params.owner

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handle_CreateAuction(event: _CreateAuctionEvent): void {
  let entity = new _CreateAuction(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity._auctionIds = event.params._auctionIds
  entity._symbol = event.params._symbol
  entity._minBidAmount = event.params._minBidAmount
  entity._endTime = event.params._endTime
  entity.owner = event.params.owner

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handle_CreateFixedSale(event: _CreateFixedSaleEvent): void {
  let entity = new _CreateFixedSale(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity._auctionId = event.params._auctionId
  entity._tokenId = event.params._tokenId
  entity._price = event.params._price
  entity.owner = event.params.owner

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handle_DeleteMarketItem(event: _DeleteMarketItemEvent): void {
  let entity = new _DeleteMarketItem(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.auctionId = event.params.auctionId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
