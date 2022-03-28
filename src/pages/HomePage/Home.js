import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "../../redux/blockchain/blockchainActions";
import { fetchData } from "./../../redux/data/dataActions";
import { StyledRoundButton } from "./../../components/styles/styledRoundButton.styled";
import * as s from "./../../styles/globalStyles";
import Navbar from "../../components/Navbar/Navbar";
import HeroSection from "../../components/HeroSection/HeroSection";
import Video from "../../components/Video/Video";
import Social from "../../components/SocialMedia/Social";
const truncate = (input, len) =>
  input.length > len ? `${input.substring(0, len)}...` : input;

function Home() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [claimingNft, setClaimingNft] = useState(false);
  const [mintDone, setMintDone] = useState(false);
  const [supply, setTotalSupply] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [mintAmount, setMintAmount] = useState(1);
  const [displayCost, setDisplayCost] = useState(0.07);
  const [click, setClick] = useState(false);
  const handleClick = () => setClick(!click);
  const [CONFIG, SET_CONFIG] = useState({
    CONTRACT_ADDRESS: "",
    SCAN_LINK: "",
    NETWORK: {
      NAME: "",
      SYMBOL: "",
      ID: 0,
    },
    NFT_NAME: "",
    SYMBOL: "",
    MAX_SUPPLY: 1,
    WEI_COST: 0,
    DISPLAY_COST: 0,
    GAS_LIMIT: 0,
    MARKETPLACE: "",
    MARKETPLACE_LINK: "",
    SHOW_BACKGROUND: false,
  });

  const claimNFTs = () => {
    let cost = CONFIG.WEI_COST;
    let gasLimit = CONFIG.GAS_LIMIT;
    let totalCostWei = String(cost * mintAmount);
    let totalGasLimit = String(gasLimit * mintAmount);
    setFeedback(`Minting your ${CONFIG.NFT_NAME}`);
    setClaimingNft(true);
    blockchain.smartContract.methods
      .mint(mintAmount)
      .send({
        gasLimit: String(totalGasLimit),
        to: CONFIG.CONTRACT_ADDRESS,
        from: blockchain.account,
        value: totalCostWei,
      })
      .once("error", (err) => {
        console.log(err);
        setFeedback("Sorry, something went wrong please try again later.");
        setClaimingNft(false);
      })
      .then((receipt) => {
        setMintDone(true);
        setFeedback(`Done, the ${CONFIG.NFT_NAME} is yours!`);
        setClaimingNft(false);
        blockchain.smartContract.methods
          .totalSupply()
          .call()
          .then((res) => {
            setTotalSupply(res);
          });

        dispatch(fetchData(blockchain.account));
      });
  };

  const decrementMintAmount = () => {
    let newMintAmount = mintAmount - 1;
    if (newMintAmount < 1) {
      newMintAmount = 1;
    }
    setMintAmount(newMintAmount);
    setDisplayCost(parseFloat(CONFIG.DISPLAY_COST * newMintAmount).toFixed(3));
  };

  const incrementMintAmount = () => {
    let newMintAmount = mintAmount + 1;
    if (newMintAmount > 2) {
      newMintAmount = 2;
    }
    setMintAmount(newMintAmount);
    setDisplayCost(parseFloat(CONFIG.DISPLAY_COST * newMintAmount).toFixed(3));
  };

  const maxNfts = () => {
    setMintAmount(2);
    setDisplayCost(parseFloat(CONFIG.DISPLAY_COST * 2).toFixed(3));
  };

  const getData = async () => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
      const totalSupply = await blockchain.smartContract.methods
        .totalSupply()
        .call();
      setTotalSupply(totalSupply);
    }
  };

  const getConfig = async () => {
    const configResponse = await fetch("/config/config.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const config = await configResponse.json();
    SET_CONFIG(config);
  };

  useEffect(() => {
    getConfig();
  }, []);

  useEffect(() => {
    getData();
  }, [blockchain.account]);


  return (
    <>
      <s.Body>
        <Navbar />
        <s.FlexContainer
          jc={"space-evenly"}
          ai={"center"}
          fd={"row"}
          mt={"3vh"}
        >
          <s.Mint>
            <s.TextTitle style={{ letterSpacing: "-0.01em", textAlign: "left", lineHeight: "136%", fontSize: "51.388px", fontWeight: "700" }}>
              MINT NOW
            </s.TextTitle>
            <s.TextSubTitle style={{textAlign:"left"}}>
              {9999 - supply} of 9999 NFT's Available
            </s.TextSubTitle>
            <s.SpacerLarge />
            <s.SpacerLarge />

            <s.FlexContainer fd={"row"} ai={"center"} jc={"space-between"}>
              <s.TextTitle>Amount</s.TextTitle>

              <s.AmountContainer ai={"center"} jc={"center"} fd={"row"}>
                <StyledRoundButton
                  style={{ lineHeight: 0.4, fontWeight: "400"}}
                  disabled={claimingNft ? 1 : 0}
                  onClick={(e) => {
                    e.preventDefault();
                    decrementMintAmount();
                  }}
                >
                  -
                </StyledRoundButton>
                <s.SpacerMedium />
                <s.TextDescription color={"#ffffff"} size={"50.69px"} style={{fontWeight: "800", border: "1px solid #fff"}}>
                  {mintAmount}
                </s.TextDescription>
                <s.SpacerMedium />
                <StyledRoundButton
                  style={{ lineHeight: 0.4, fontWeight: "400"}}
                  disabled={claimingNft ? 1 : 0}
                  onClick={(e) => {
                    e.preventDefault();
                    incrementMintAmount();
                  }}
                >
                  +
                </StyledRoundButton>
              </s.AmountContainer>
              <s.TextSubTitle size={1.5} style={{ fontWeight: 700 }} color={"#ffffff"} align={"right"}>
                Max 2
              </s.TextSubTitle>
            </s.FlexContainer>


            <s.SpacerSmall />
            <s.Line />
            <s.SpacerLarge />
            <s.FlexContainer fd={"row"} ai={"center"} jc={"space-between"}>
              <s.TextTitle>Total</s.TextTitle>
              <s.TextTitle style={{ fontWeight: 700, fontSize: "50.69px" }}>{displayCost}</s.TextTitle>
            </s.FlexContainer>
            <s.SpacerSmall />
            <s.Line />
            <s.SpacerSmall />

            {blockchain.account !== "" && blockchain.smartContract !== null ? (
              <s.Container ai={"center"} jc={"center"} fd={"row"}>
                <s.connectButton
                  disabled={claimingNft ? 1 : 0}
                  onClick={(e) => {
                    e.preventDefault();
                    claimNFTs();
                    getData();
                  }}
                >
                  {" "}
                  {claimingNft ? "Confirm Transaction in Wallet" : "Mint"}{" "}
                  {mintDone ? feedback : ""}{" "}
                </s.connectButton>{" "}
              </s.Container>
            ) : (
              <s.connectButton
                style={{
                  textAlign: "center",
                  color: "#ffffff",
                  cursor: "pointer",
                }}
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(connect());
                  getData();
                }}
              >
                Connect to Wallet
              </s.connectButton>
            )}

            {blockchain.errorMsg !== "" ? (
              <s.connectButton
                style={{
                  textAlign: "center",
                  color: "#ffffff",
                  cursor: "pointer",
                }}
              >
                {feedback}
              </s.connectButton>
            ) : (
              ""
            )}
          </s.Mint>
        </s.FlexContainer>
        {/* <s.SpacerLarge /> */}
        {/* <Social/> */}
      </s.Body>
    </>
  );
}

export default Home;
