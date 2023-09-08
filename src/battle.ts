import { Address, BigDecimal, BigInt } from "@graphprotocol/graph-ts";
import {
  _BattleStateChanged,
  _BetBattle,
  _CreateBattle,
  _EndBattle as EndBattleEvent,
  Battle as BattleContract,
  _ClaimedReward,
  _Withdraw as WithdrawEvent,
} from "../generated/Battle/Battle";
import { Battle, Participant, User } from "../generated/schema";

export function handle_CreateBattle(event: _CreateBattle): void {
  let battle = new Battle(event.params._battleId.toString());

  battle.battleId = event.params._battleId;
  battle.exchange = event.params.exchange;
  battle.country = event.params.country;
  battle.startTime = event.params.startTime;
  battle.endTime = event.params.endTime;
  battle.entryfee = event.params.entryFee;
  battle.nftCount = event.params.nftCount;
  battle.passcode = event.params.passcode;
  battle.owner = event.params.owner.toHexString();
  battle.battleType = event.params.battleType.toString() == "0" ? "HEALTH" : "BLOOD";
  battle.battleStatus = "BETTING";
  battle.totalParticipants = BigInt.zero();

  battle.save();

  let user = User.load(event.params.owner.toHexString());

  if (!user) {
    let user = new User(event.params.owner.toHexString());
    user.totalPercentile = BigDecimal.zero();
    user.save();
  }
}

export function handleBetBattle(event: _BetBattle): void {
  let id = event.params._battleId.toString() + "-" + event.params._playerAddress.toHexString();
  let nftIds = event.params._nftIds;
  let scalarIds = event.params._scalarIds;
  let participant = new Participant(id);

  participant.battle = event.params._battleId.toString();
  participant.user = event.params._playerAddress.toHexString();
  participant.isRewardClaimed = false;
  participant.rewardAmount = BigInt.zero();
  participant.percentile = BigDecimal.zero();

  let newNftIds: string[] = [];
  let newScalarIds: string[] = [];

  for (let i = 0; i < nftIds.length; i++) {
    newNftIds.push(nftIds[i].toString());
  }
  for (let i = 0; i < scalarIds.length; i++) {
    newScalarIds.push(scalarIds[i].toString());
  }

  participant.billionsIds = newNftIds;
  participant.scalarIds = newScalarIds;
  participant.save();

  let battle = Battle.load(event.params._battleId.toString());

  if (battle) {
    battle.totalParticipants = battle.totalParticipants.plus(BigInt.fromI32(1));
    battle.save();
  }

  let user = User.load(event.params._playerAddress.toHexString());

  if (!user) {
    let user = new User(event.params._playerAddress.toHexString());
    user.totalPercentile = BigDecimal.zero();
    user.save();
  }
}

export function handleBattleStateChanged(event: _BattleStateChanged): void {
  let battle = Battle.load(event.params._battleId.toString());

  if (!battle) return;

  let battleStatus = event.params.state.toString();

  if (battleStatus == "0") {
    battle.battleStatus = "BETTING";
  }
  if (battleStatus == "1") {
    battle.battleStatus = "STARTED";
  }
  if (battleStatus == "2") {
    battle.battleStatus = "ENDED";
  }
  if (battleStatus == "3") {
    battle.battleStatus = "EXPIRED";
  }

  battle.save();
}

export function handleClaimedReward(event: _ClaimedReward): void {
  let player = event.params._player.toHexString();
  let battleId = event.params._battleId.toString();
  let id = battleId + "-" + player;

  let participant = Participant.load(id);

  if (participant != null) {
    participant.rewardAmount = event.params._amount;
    participant.isRewardClaimed = true;
    participant.save();
  }
}

export function handleEndBattle(event: EndBattleEvent): void {
  let battleId = event.params._battleId;
  let battle = Battle.load(battleId.toString());

  if (!battle) return;

  let battleContract = BattleContract.bind(event.address);

  let battleInfo = battleContract.GetBattle(battleId);
  let playerCount = battleContract.GetPlayerCountInBattle(battleId);
  let totalAmount = battleInfo.entryFee.times(playerCount);

  let rakePrizePool = event.params.rakePrizepool;
  let bonusPrizePool = event.params.leaderPrizepool;
  let rewardPrizePool = totalAmount.minus(bonusPrizePool.plus(rakePrizePool));

  let rankIndex = 1;

  if (playerCount.lt(BigInt.fromI32(6))) {
    if (playerCount.equals(BigInt.fromI32(5))) {
      calculateForLessParticipants(battleId, playerCount, rewardPrizePool, event.params._ranks, [
        BigInt.fromI32(450),
        BigInt.fromI32(300),
        BigInt.fromI32(150),
        BigInt.fromI32(100),
        BigInt.fromI32(0),
      ]);
    }
    if (playerCount.equals(BigInt.fromI32(4))) {
      calculateForLessParticipants(battleId, playerCount, rewardPrizePool, event.params._ranks, [
        BigInt.fromI32(500),
        BigInt.fromI32(250),
        BigInt.fromI32(150),
        BigInt.fromI32(100),
        BigInt.fromI32(0),
      ]);
    }
    if (playerCount.equals(BigInt.fromI32(3))) {
      calculateForLessParticipants(battleId, playerCount, rewardPrizePool, event.params._ranks, [
        BigInt.fromI32(600),
        BigInt.fromI32(300),
        BigInt.fromI32(100),
        BigInt.fromI32(0),
        BigInt.fromI32(0),
      ]);
    }
    if (playerCount.equals(BigInt.fromI32(2))) {
      calculateForLessParticipants(battleId, playerCount, rewardPrizePool, event.params._ranks, [
        BigInt.fromI32(900),
        BigInt.fromI32(100),
        BigInt.fromI32(0),
        BigInt.fromI32(0),
        BigInt.fromI32(0),
      ]);
    }
    if (playerCount.equals(BigInt.fromI32(1))) {
      calculateForLessParticipants(battleId, playerCount, rewardPrizePool, event.params._ranks, [
        BigInt.fromI32(1000),
        BigInt.fromI32(0),
        BigInt.fromI32(0),
        BigInt.fromI32(0),
        BigInt.fromI32(0),
      ]);
    }
  } else {
    // ALLOCATION OF REWARDS TO THE PARTICIPANTS

    let rewardPercent1 = battleContract.rewardPercent(BigInt.fromI32(0));
    let rewardPercent2 = battleContract.rewardPercent(BigInt.fromI32(1));
    let rewardPercent3 = battleContract.rewardPercent(BigInt.fromI32(2));
    let rewardPercent4 = battleContract.rewardPercent(BigInt.fromI32(3));

    let _rank1Rewards = rewardPrizePool.times(rewardPercent1).div(BigInt.fromI32(1000));
    let _rank2Rewards = rewardPrizePool.times(rewardPercent2).div(BigInt.fromI32(1000));
    let _rank3Rewards = rewardPrizePool.times(rewardPercent3).div(BigInt.fromI32(1000));
    let _rank4Rewards = rewardPrizePool.times(rewardPercent4).div(BigInt.fromI32(1000));

    for (let i = 0; i < event.params.rank1.length; i++) {
      let rewardAddress = event.params.rank1[i];
      let id = battleId.toString() + "-" + rewardAddress.toHexString();

      let playerReward = _rank1Rewards.div(BigInt.fromI32(event.params.rank1.length));
      let participant = Participant.load(id);

      if (participant != null) {
        let totalCalculate = playerCount.minus(BigInt.fromI32(rankIndex));
        let x = totalCalculate.plus(BigInt.fromI32(1));
        let y = x.toBigDecimal().div(playerCount.toBigDecimal());
        let percentile = y.times(BigDecimal.fromString("100"));

        participant.percentile = percentile;
        participant.rank = BigInt.fromI32(rankIndex);
        participant.rewardAmount = playerReward;
        participant.save();

        let user = User.load(rewardAddress.toHexString());

        if (user != null) {
          user.totalPercentile = user.totalPercentile.plus(percentile);
          user.save();
        }
      }

      rankIndex += 1;
    }

    for (let i = 0; i < event.params.rank2.length; i++) {
      let rewardAddress = event.params.rank2[i];
      let id = battleId.toString() + "-" + rewardAddress.toHexString();

      let playerReward = _rank2Rewards.div(BigInt.fromI32(event.params.rank2.length));
      let participant = Participant.load(id);

      if (participant != null) {
        let totalCalculate = playerCount.minus(BigInt.fromI32(rankIndex));
        let x = totalCalculate.plus(BigInt.fromI32(1));
        let y = x.toBigDecimal().div(playerCount.toBigDecimal());
        let percentile = y.times(BigDecimal.fromString("100"));

        participant.percentile = percentile;
        participant.rank = BigInt.fromI32(rankIndex);
        participant.rewardAmount = playerReward;
        participant.save();

        let user = User.load(rewardAddress.toHexString());

        if (user != null) {
          user.totalPercentile = user.totalPercentile.plus(percentile);
          user.save();
        }
      }

      rankIndex += 1;
    }

    for (let i = 0; i < event.params.rank3.length; i++) {
      let rewardAddress = event.params.rank3[i];
      let id = battleId.toString() + "-" + rewardAddress.toHexString();

      let playerReward = _rank3Rewards.div(BigInt.fromI32(event.params.rank3.length));
      let participant = Participant.load(id);

      if (participant != null) {
        let totalCalculate = playerCount.minus(BigInt.fromI32(rankIndex));
        let x = totalCalculate.plus(BigInt.fromI32(1));
        let y = x.toBigDecimal().div(playerCount.toBigDecimal());
        let percentile = y.times(BigDecimal.fromString("100"));

        participant.percentile = percentile;
        participant.rank = BigInt.fromI32(rankIndex);
        participant.rewardAmount = playerReward;
        participant.save();

        let user = User.load(rewardAddress.toHexString());

        if (user != null) {
          user.totalPercentile = user.totalPercentile.plus(percentile);
          user.save();
        }
      }

      rankIndex += 1;
    }

    for (let i = 0; i < event.params.rank4.length; i++) {
      let rewardAddress = event.params.rank4[i];
      let id = battleId.toString() + "-" + rewardAddress.toHexString();

      let playerReward = _rank4Rewards.div(BigInt.fromI32(event.params.rank4.length));
      let participant = Participant.load(id);

      if (participant != null) {
        let totalCalculate = playerCount.minus(BigInt.fromI32(rankIndex));
        let x = totalCalculate.plus(BigInt.fromI32(1));
        let y = x.toBigDecimal().div(playerCount.toBigDecimal());
        let percentile = y.times(BigDecimal.fromString("100"));

        participant.percentile = percentile;
        participant.rank = BigInt.fromI32(rankIndex);
        participant.rewardAmount = playerReward;
        participant.save();

        let user = User.load(rewardAddress.toHexString());

        if (user != null) {
          user.totalPercentile = user.totalPercentile.plus(percentile);
          user.save();
        }
      }

      rankIndex += 1;
    }

    // ALLOCATION OF BONUS TO THE PARTICIPANTS

    for (let i = 0; i < event.params._ranks.length; i++) {
      const bonusAddress = event.params._ranks[i];
      let id = battleId.toString() + "-" + bonusAddress.toHexString();

      let playerBonus = bonusPrizePool
        .times(battleContract.bonusPercent(BigInt.fromI32(i)))
        .div(BigInt.fromI32(1000));
      let participant = Participant.load(id);

      if (participant != null) {
        participant.rewardAmount = participant.rewardAmount.plus(playerBonus);
        participant.save();
      }
    }
  }
}

export function handleWithdraw(event: WithdrawEvent): void {}

function calculateForLessParticipants(
  battleId: BigInt,
  playerCount: BigInt,
  rewardPrizePool: BigInt,
  _ranks: Address[],
  percent: BigInt[]
): void {
  let rankIndex = 1;

  for (let i = 0; i < _ranks.length; i++) {
    let rewardAddress = _ranks[i];
    let id = battleId.toString() + "-" + rewardAddress.toHexString();

    let playerReward = rewardPrizePool.times(percent[i]).div(BigInt.fromI32(1000));
    let participant = Participant.load(id);

    if (participant != null) {
      let totalCalculate = playerCount.minus(BigInt.fromI32(rankIndex));
      let x = totalCalculate.plus(BigInt.fromI32(1));
      let y = x.toBigDecimal().div(playerCount.toBigDecimal());
      let percentile = y.times(BigDecimal.fromString("100"));

      participant.percentile = percentile;
      participant.rank = BigInt.fromI32(rankIndex);
      participant.rewardAmount = playerReward;
      participant.save();

      let user = User.load(rewardAddress.toHexString());

      if (user != null) {
        user.totalPercentile = user.totalPercentile.plus(percentile);
        user.save();
      }
    }

    rankIndex += 1;
  }
}
