import { BigDecimal } from "@graphprotocol/graph-ts";
import {
  MintNft as MintNftEvent,
  Transfer as TransferEvent,
} from "../generated/ScalarNFT/ScalarNFT";
import { ScalarNFT, User } from "../generated/schema";

export function handleTransfer(event: TransferEvent): void {
  let token = ScalarNFT.load(event.params.tokenId.toString());
  if (!token) {
    token = new ScalarNFT(event.params.tokenId.toString());
    token.tokenId = event.params.tokenId;
  }
  token.owner = event.params.to.toHexString();
  token.save();

  let user = User.load(event.params.to.toHexString());

  if (!user) {
    let user = new User(event.params.to.toHexString());
    user.totalPercentile = BigDecimal.zero();
    user.save();
  }
}

export function handleMintNft(event: MintNftEvent): void {
  let tokenId = event.params.tokenId;
  let scalarValue = event.params.scalarValue;

  let token = ScalarNFT.load(tokenId.toString());

  if (!token) {
    token = new ScalarNFT(tokenId.toString());
    token.owner = event.params.user.toHexString();
    token.tokenId = tokenId;
  }

  token.value = scalarValue.toString();
  token.save();
}
