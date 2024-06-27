import React, { useEffect, useState } from "react";
import axios from "axios";
import io from "socket.io-client"; // Import the Socket.IO client
import { motion, AnimatePresence } from "framer-motion";
import { gimmick } from "../effects/coins"

const socket = io("http://localhost:3001");

function Home() {
const [ListOfDonations, setListOfDonations] = useState([]);
const [ListOfWithdrawals, setListOfWithdrawals] = useState([]);
const [ListOfTransfers, setListOfTransfers] = useState([]);
const [DonationAmounts, setDonationAmounts] = useState([]);
const [showDonateAnimation, setShowDonateAnimation] = useState(false);
const [showWithdrawAnimation, setShowWithdrawAnimation] = useState(false);


const fetchDonationsAndWithdrawals = () => {
  axios.get("http://localhost:3001/donations").then((response) => {
    //fix signature data
    response.data.forEach((item) => {
      item.type = 'donation'
    });
    setListOfDonations(response.data);
  });
  axios.get("http://localhost:3001/withdrawals").then((response) => {
    
    response.data.forEach((item) => {
      item.type = 'withdrawal'
    });
    setListOfWithdrawals(response.data);
  });
}

const fetchDonationAmounts = () => {
  axios.get("http://localhost:3001/donations/amounts").then((response) => {
    setDonationAmounts(response.data);
  });
};

const handleNewDonation = (newDonationData) => {
  setListOfTransfers((prevList) => [newDonationData, ...prevList.slice(0, -1)]);
  setShowDonateAnimation(true);
  setTimeout(() => {
    setShowDonateAnimation(false);
  }, 15000);

  fetchDonationAmounts();
};

const handleNewWithdrawal = (newWithdrawalData) => {
  setListOfTransfers((prevList) => [newWithdrawalData, ...prevList.slice(0, -1)]);
  setShowWithdrawAnimation(true);
  setTimeout(() => {
    setShowWithdrawAnimation(false);
  }, 15000);

  fetchDonationAmounts();
  console.log(newWithdrawalData)
};


useEffect(() => {
  socket.on("newDonation", handleNewDonation);
  socket.on("newWithdrawal", handleNewWithdrawal);
  fetchDonationsAndWithdrawals();
  fetchDonationAmounts();

  return () => {
    socket.off("newDonation", handleNewDonation);
    socket.off("newWithdrawal", handleNewWithdrawal);
  };
}, []);

useEffect(() => {
  setListOfTransfers([...ListOfDonations, ...ListOfWithdrawals]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)))
}, [ListOfDonations, ListOfWithdrawals]);


  console.log("render home.js");

  return (
    <div className="sticky">
      <div className="bankInfo">
        <h1>DO TEJ PORY ZEBRANO: &nbsp;{DonationAmounts.totalAmount},-</h1>
        <h1>AKTUALNIE W BANKU MAMY: &nbsp;{DonationAmounts.totalRemainingAmount},-</h1>
      </div>
      <div className="bubbles">
        {ListOfTransfers.map((value, key) => {
          return (
            <div key={key} className="bubble">
              <div className="donationAmount">
                <p>{value.name} <br></br>{value.type === 'donation' ? 'wplacil/a' : 'wyplacil/a'} <br></br> {value.amount} ,-</p>
              </div>
            </div>
          );
        })}
      </div>
      <AnimatePresence>
        {showDonateAnimation && (
          <motion.div
            initial={{ opacity: 0}}
            animate={{ opacity: 1}}
            transition={{duration: 3}}
            exit={{ opacity: 0}}
          >
            <div className="coinRainOpacity"></div>
              <div className="coinRain">
                <h3>
                  {ListOfTransfers[0] ? ListOfTransfers[0].name : "błąd"} JUST DONATED {ListOfTransfers[0] ? ListOfTransfers[0].amount : "błąd"}{" "}
                   ,- <br /> {ListOfTransfers[0] ? ListOfTransfers[0].ageRange !== '0' ? "AGE: " + ListOfTransfers[0].ageRange : "" : "błąd"} <br /> THANKS!
                </h3>
                {gimmick('coinRain')}
              </div>
          </motion.div>
        )}
        {showWithdrawAnimation && (
          <motion.div
            initial={{ opacity: 0}}
            animate={{ opacity: 1}}
            transition={{duration: 3}}
            exit={{ opacity: 0}}
          >
          <div className="coinRainOpacity"></div>
              <div className="coinRain"> 
            <h3>
              {ListOfTransfers[0] ? ListOfTransfers[0].name : "błąd"} właśnie
              wykorzystał {ListOfTransfers[0] ? ListOfTransfers[0].amount : "błąd"}{" "}
              zł. <br /> Smacznego :)
              Wspomogli go: {ListOfTransfers[0] ? ListOfTransfers[0].donorsNames.toString() : "błąd"}
            </h3>
            {gimmick('coinRain')}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Home;
