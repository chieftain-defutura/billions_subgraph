import { BigInt } from "@graphprotocol/graph-ts";
import {
  Transfer as TransferEvent,
  _BillionsNftMint as _BillionsNftMintEvent,
  _RentNft as _RentNftEvent,
  _UpdateRentalStatus as _UpdateRentalStatusEvent,
} from "../generated/BillionsNFT/BillionsNFT";
import { BillionsNFT, RentedNft, User } from "../generated/schema";

export function handleTransfer(event: TransferEvent): void {
  let tokenId = event.params.tokenId.toString();
  let token = BillionsNFT.load(tokenId);

  if (!token) {
    token = new BillionsNFT(tokenId);
    token.tokenId = event.params.tokenId;
    token.symbol = "";
    token.rentPrice = BigInt.zero();
    token.rentable = false;
  }

  token.owner = event.params.to.toHexString();
  token.save();

  let user = User.load(event.params.to.toHexString());

  if (!user) {
    let user = new User(event.params.to.toHexString());
    user.save();
  }
}

export function handleBillionsNftMint(event: _BillionsNftMintEvent): void {
  let token = BillionsNFT.load(event.params.tokenId.toString());

  if (!token) {
    token = new BillionsNFT(event.params.tokenId.toString());
    token.owner = event.params.owner.toHexString();
    token.tokenId = event.params.tokenId;
    token.symbol = event.params.symbol;
    token.rentPrice = BigInt.zero();
    token.rentable = false;
  }

  token.symbol = event.params.symbol;
  token.save();

  let user = User.load(event.params.owner.toHexString());

  if (!user) {
    let user = new User(event.params.owner.toHexString());
    user.save();
  }
}

export function handleUpdateRentalStatus(event: _UpdateRentalStatusEvent): void {
  let tokenId = event.params.tokenId.toString();

  let billionsNft = BillionsNFT.load(tokenId);

  if (!billionsNft) return;

  billionsNft.rentPrice = event.params.price;
  billionsNft.rentable = event.params.isRental;

  billionsNft.save();
}

export function handleRentNft(event: _RentNftEvent): void {
  let id = event.transaction.hash.toHex() + "-" + event.logIndex.toString();

  let rentedNft = new RentedNft(id);

  rentedNft.battleId = event.params.battleId;
  rentedNft.tokenId = event.params.tokenId;
  rentedNft.owner = event.params.user.toHexString();
  rentedNft.save();
}
