import {
  _CreateAuction,
  _CreateFixedSale,
  _Buy,
  _Bid,
  _Claim,
  MarketPlace,
  _CancelFixedSale as _CancelFixedSaleEvent,
} from "../generated/MarketPlace/MarketPlace";
import { BillionsNFT } from "../generated/MarketPlace/BillionsNFT";
import { Marketplace, Bidder } from "../generated/schema";

export function handle_CreateAuction(event: _CreateAuction): void {
  let owner = event.params.owner;
  let auctionIds = event.params._auctionIds;
  let min = event.params._minBidAmount;
  let symbol = event.params._symbol;

  for (let i = 0; i < auctionIds.length; i++) {
    const element = auctionIds[i];
    let auction = new Marketplace(element.toString());
    auction.isAuction = true;
    auction.currentHighestBidder = owner;
    auction.creator = owner;
    auction.basePrice = min;
    auction.currentBidPrice = min;
    auction.status = "Pending";
    auction.bidders = [];
    auction.symbol = symbol[i];
    auction.endTime = event.params._endTime;
    auction.save();
  }
}

export function handle_Bid(event: _Bid): void {
  let auctionId = event.params._auctionId.toString();
  let bidder = event.params.bidder;
  let bidAmount = event.params.bidAmount;
  let auction = Marketplace.load(auctionId);

  if (!auction) return;

  let bidderInfoId = event.transaction.hash.toHex() + "-" + event.logIndex.toString();

  let bidderInfo = new Bidder(bidderInfoId);
  bidderInfo.bidTime = event.block.timestamp;
  bidderInfo.bidAmount = bidAmount;
  bidderInfo.bidder = bidder;
  bidderInfo.save();

  auction.currentHighestBidder = bidder;
  auction.currentBidPrice = bidAmount;

  let bidders = auction.bidders || [];
  bidders.push(bidderInfo.id);
  auction.bidders = bidders;

  auction.save();
}

export function handle_CreateFixedSale(event: _CreateFixedSale): void {
  let auctionId = event.params._auctionId;
  let tokenId = event.params._tokenId;
  let price = event.params._price;
  let owner = event.params.owner;

  let auctionIdString = auctionId.toString();

  let auction = new Marketplace(auctionIdString);
  auction.isAuction = false;
  auction.currentHighestBidder = owner;
  auction.creator = owner;
  auction.basePrice = price;
  auction.currentBidPrice = price;
  auction.bidders = [];
  auction.tokenId = tokenId;
  auction.status = "Pending";

  let marketplaceContract = MarketPlace.bind(event.address);
  let battleNftContract = BillionsNFT.bind(marketplaceContract.billionsNftAddress());

  let data = battleNftContract.nftInfos(tokenId);
  auction.symbol = data.getSymbol();

  auction.save();
}

export function handle_Buy(event: _Buy): void {
  let buyer = event.params.buyer;
  let auctionId = event.params._auctionId;

  let auctionIdString = auctionId.toString();

  let auction = Marketplace.load(auctionIdString);

  if (!auction) return;

  auction.currentHighestBidder = buyer;
  auction.buyer = buyer;
  auction.status = "Finished";
  auction.save();
}

export function handle_Claim(event: _Claim): void {
  let auctionId = event.params._auctionid;
  let tokenId = event.params.tokenId;
  let owner = event.params.owner;

  let auction = Marketplace.load(auctionId.toString());

  if (!auction) return;

  auction.currentHighestBidder = owner;
  auction.tokenId = tokenId;
  auction.status = "Finished";
  auction.save();
}

export function handle_CancelFixedSale(event: _CancelFixedSaleEvent): void {
  let auctionId = event.params._auctionId.toString();

  let marketplace = Marketplace.load(auctionId);

  if (!marketplace) return;

  marketplace.status = "Cancelled";
  marketplace.save();
}
