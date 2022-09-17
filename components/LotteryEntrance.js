import { useMoralis, useMoralisWeb3Api, useWeb3Contract, useNativeBalance } from "react-moralis"
import helperConfig from "../helper-config.json"
import networkMapping from "../chain-info/deployments/map.json"
import Lottery from "../chain-info/contracts/Lottery.json"
import { useEffect, useState } from "react"
import { useNotification, Web3Api } from "web3uikit"

export default function LotteryEntrance() {
    const {
        Moralis,
        isAuthenticated,
        isWeb3Enabled,
        enableWeb3,
        chainId: chainIdHex,
        isInitialized,
    } = useMoralis()
    const chainId = parseInt(chainIdHex)
    console.log(chainId)
    const networkName = chainId ? helperConfig[chainId] : "dev"
    console.log(networkName)
    const lotteryAddress =
        String(chainId) in networkMapping ? networkMapping[chainId]["Lottery"][0] : null
    console.log(lotteryAddress)
    const { abi } = Lottery
    const [entranceFee, setEntrancefee] = useState("0")
    const [lotteryState, setLotteryState] = useState("0")
    const [recentWinner, setRecentWinner] = useState("0")
    const [lotteryTreasury, setLotteryTreasury] = useState("0")
    const [numOfParticipants, setNumOfParticipants] = useState("0")

    const dispatch = useNotification()

    const handleSuccess = async function (tx) {
        await tx.wait(1)
        handleNewNotification(tx)
    }

    const handleNewNotification = () => {
        dispatch({
            type: "info",
            message: "Transaction Complete",
            title: "Transaction Notification",
            icon: "",
            position: "topR",
        })
    }

    const { runContractFunction: getLotteryState } = useWeb3Contract({
        abi: abi,
        contractAddress: lotteryAddress,
        functionName: "lottery_state",
        params: {},
    })

    const { runContractFunction: getLotteryWinner } = useWeb3Contract({
        abi: abi,
        contractAddress: lotteryAddress,
        functionName: "recentWinner",
        params: {},
    })

    const {
        runContractFunction: enterRaffle,
        isLoading,
        isFetching,
    } = useWeb3Contract({
        abi: abi,
        contractAddress: lotteryAddress,
        functionName: "enter",
        params: {},
        msgValue: entranceFee,
    })

    const { runContractFunction: getEntranceFee } = useWeb3Contract({
        abi: abi,
        contractAddress: lotteryAddress,
        functionName: "getEntranceFee",
        params: {},
    })

    const { runContractFunction: getLotteryTreasury } = useWeb3Contract({
        abi: abi,
        contractAddress: lotteryAddress,
        functionName: "getLotteryTreasury",
        params: {},
    })

    const { runContractFunction: getNumOfParticipants } = useWeb3Contract({
        abi: abi,
        contractAddress: lotteryAddress,
        functionName: "getNumOfParticipants",
        params: {},
    })

    useEffect(() => {
        if (isWeb3Enabled) {
            async function updateUI() {
                const entranceFeeFromContractCall = (await getEntranceFee()).toString()
                const lotteryStateFromContractCall = await getLotteryState()
                const recentWinnerFromContractCall = await getLotteryWinner()
                const lotterytreasuryFromContractCall = (await getLotteryTreasury()).toString()
                const numOfParticipantsFromContractCall = (await getNumOfParticipants()).toString()
                setEntrancefee(entranceFeeFromContractCall)
                setLotteryState(lotteryStateFromContractCall)
                setRecentWinner(recentWinnerFromContractCall)
                setLotteryTreasury(lotterytreasuryFromContractCall)
                setNumOfParticipants(numOfParticipantsFromContractCall)
            }
            updateUI()
        }
    }, [isWeb3Enabled, entranceFee, lotteryState, lotteryTreasury, numOfParticipants])

    return (
        <div className="p-5">
            {lotteryAddress ? (
                <div>
                    {lotteryState ? (
                        <div className="font-bold">Lottery is closed now!</div>
                    ) : (
                        <div>
                            <h3 className="py-3 font-bold">Lottery is open, JOIN NOW!</h3>
                            <div>
                                <div className="py-3">
                                    Current Price Pool: {lotteryTreasury / 1e18} ETH
                                </div>
                                <span> Entrance Fee: {entranceFee / 1e18} ETH --> </span>
                                <button
                                    className="bg-blue-400 hover:bg-blue-600 text-white py-2  px-4 rounded ml-auto "
                                    onClick={async function () {
                                        await enterRaffle({
                                            onSuccess: handleSuccess,
                                            onError: (error) => console.log(error),
                                        })
                                    }}
                                    disabled={isFetching || isFetching}
                                >
                                    {isFetching || isLoading ? (
                                        <div>
                                            <svg className="animate-spin ease h-3 w-3 rounded border-2 border-white inline"></svg>
                                            <span className="px-2">Processing...</span>
                                        </div>
                                    ) : (
                                        <div>Enter Raffle</div>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}
                    <div className="py-3">Current number of participants: {numOfParticipants}</div>
                    {}
                    <div className="py-3">Recent Winner is: {recentWinner}</div>
                </div>
            ) : (
                <div className="font-bold">No Lottery Address Is Found!</div>
            )}
        </div>
    )
}
