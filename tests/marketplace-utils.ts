import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
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
} from "../generated/Marketplace/Marketplace"

export function createOwnershipTransferredEvent(
  previousOwner: Address,
  newOwner: Address
): OwnershipTransferred {
  let ownershipTransferredEvent = changetype<OwnershipTransferred>(
    newMockEvent()
  )

  ownershipTransferredEvent.parameters = new Array()

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  )
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return ownershipTransferredEvent
}

export function create_AcceptEvent(
  _auctionId: BigInt,
  owner: Address
): _Accept {
  let acceptEvent = changetype<_Accept>(newMockEvent())

  acceptEvent.parameters = new Array()

  acceptEvent.parameters.push(
    new ethereum.EventParam(
      "_auctionId",
      ethereum.Value.fromUnsignedBigInt(_auctionId)
    )
  )
  acceptEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )

  return acceptEvent
}

export function create_BidEvent(
  _auctionId: BigInt,
  bidder: Address,
  bidAmount: BigInt
): _Bid {
  let bidEvent = changetype<_Bid>(newMockEvent())

  bidEvent.parameters = new Array()

  bidEvent.parameters.push(
    new ethereum.EventParam(
      "_auctionId",
      ethereum.Value.fromUnsignedBigInt(_auctionId)
    )
  )
  bidEvent.parameters.push(
    new ethereum.EventParam("bidder", ethereum.Value.fromAddress(bidder))
  )
  bidEvent.parameters.push(
    new ethereum.EventParam(
      "bidAmount",
      ethereum.Value.fromUnsignedBigInt(bidAmount)
    )
  )

  return bidEvent
}

export function create_BuyEvent(_auctionId: BigInt, buyer: Address): _Buy {
  let buyEvent = changetype<_Buy>(newMockEvent())

  buyEvent.parameters = new Array()

  buyEvent.parameters.push(
    new ethereum.EventParam(
      "_auctionId",
      ethereum.Value.fromUnsignedBigInt(_auctionId)
    )
  )
  buyEvent.parameters.push(
    new ethereum.EventParam("buyer", ethereum.Value.fromAddress(buyer))
  )

  return buyEvent
}

export function create_CancelBidEvent(
  _auctionId: BigInt,
  bidder: Address
): _CancelBid {
  let cancelBidEvent = changetype<_CancelBid>(newMockEvent())

  cancelBidEvent.parameters = new Array()

  cancelBidEvent.parameters.push(
    new ethereum.EventParam(
      "_auctionId",
      ethereum.Value.fromUnsignedBigInt(_auctionId)
    )
  )
  cancelBidEvent.parameters.push(
    new ethereum.EventParam("bidder", ethereum.Value.fromAddress(bidder))
  )

  return cancelBidEvent
}

export function create_CancelFixedSaleEvent(
  _auctionId: BigInt
): _CancelFixedSale {
  let cancelFixedSaleEvent = changetype<_CancelFixedSale>(newMockEvent())

  cancelFixedSaleEvent.parameters = new Array()

  cancelFixedSaleEvent.parameters.push(
    new ethereum.EventParam(
      "_auctionId",
      ethereum.Value.fromUnsignedBigInt(_auctionId)
    )
  )

  return cancelFixedSaleEvent
}

export function create_ClaimEvent(
  _auctionid: BigInt,
  tokenId: BigInt,
  owner: Address
): _Claim {
  let claimEvent = changetype<_Claim>(newMockEvent())

  claimEvent.parameters = new Array()

  claimEvent.parameters.push(
    new ethereum.EventParam(
      "_auctionid",
      ethereum.Value.fromUnsignedBigInt(_auctionid)
    )
  )
  claimEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  claimEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )

  return claimEvent
}

export function create_CreateAuctionEvent(
  _auctionIds: Array<i32>,
  _symbol: Array<string>,
  _minBidAmount: BigInt,
  _endTime: BigInt,
  owner: Address
): _CreateAuction {
  let createAuctionEvent = changetype<_CreateAuction>(newMockEvent())

  createAuctionEvent.parameters = new Array()

  createAuctionEvent.parameters.push(
    new ethereum.EventParam(
      "_auctionIds",
      ethereum.Value.fromI32Array(_auctionIds)
    )
  )
  createAuctionEvent.parameters.push(
    new ethereum.EventParam("_symbol", ethereum.Value.fromStringArray(_symbol))
  )
  createAuctionEvent.parameters.push(
    new ethereum.EventParam(
      "_minBidAmount",
      ethereum.Value.fromUnsignedBigInt(_minBidAmount)
    )
  )
  createAuctionEvent.parameters.push(
    new ethereum.EventParam(
      "_endTime",
      ethereum.Value.fromUnsignedBigInt(_endTime)
    )
  )
  createAuctionEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )

  return createAuctionEvent
}

export function create_CreateFixedSaleEvent(
  _auctionId: BigInt,
  _tokenId: BigInt,
  _price: BigInt,
  owner: Address
): _CreateFixedSale {
  let createFixedSaleEvent = changetype<_CreateFixedSale>(newMockEvent())

  createFixedSaleEvent.parameters = new Array()

  createFixedSaleEvent.parameters.push(
    new ethereum.EventParam(
      "_auctionId",
      ethereum.Value.fromUnsignedBigInt(_auctionId)
    )
  )
  createFixedSaleEvent.parameters.push(
    new ethereum.EventParam(
      "_tokenId",
      ethereum.Value.fromUnsignedBigInt(_tokenId)
    )
  )
  createFixedSaleEvent.parameters.push(
    new ethereum.EventParam("_price", ethereum.Value.fromUnsignedBigInt(_price))
  )
  createFixedSaleEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )

  return createFixedSaleEvent
}

export function create_DeleteMarketItemEvent(
  auctionId: BigInt
): _DeleteMarketItem {
  let deleteMarketItemEvent = changetype<_DeleteMarketItem>(newMockEvent())

  deleteMarketItemEvent.parameters = new Array()

  deleteMarketItemEvent.parameters.push(
    new ethereum.EventParam(
      "auctionId",
      ethereum.Value.fromUnsignedBigInt(auctionId)
    )
  )

  return deleteMarketItemEvent
}
