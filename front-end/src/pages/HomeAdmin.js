import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function HomeAdmin() {
const [ListOfDonations, setListOfDonations] = useState([]);
const [ListOfWithdrawals, setListOfWithdrawals] = useState([]);
const [ListOfTransfers, setListOfTransfers] = useState([]);
const [DonationAmounts, setDonationAmounts] = useState([]);
const navigate = useNavigate();

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
}


useEffect(() => {
  fetchDonationsAndWithdrawals();
  fetchDonationAmounts();
}, []);

useEffect(() => {
  setListOfTransfers([...ListOfDonations, ...ListOfWithdrawals]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)))
}, [ListOfDonations, ListOfWithdrawals]);

  const toggleVisibility = (rowIndex) => {
    var elements = document.getElementsByClassName(`donationButton${rowIndex}`);
    var otherElements = document.getElementsByClassName(`donationButton`);
    let action = "";

    action = !elements[0].classList.contains("displayAsBlock")
      ? "remove"
      : "add";

    for (let i = 0; i < otherElements.length; i++) {
      otherElements[i].classList.remove("displayAsBlock");
    }

    if (action !== "add")
      for (let i = 0; i < elements.length; i++) {
        elements[i].classList.add("displayAsBlock");
      }
  };

  return (
    <div className="container">
      <div className="card">
        <h1> BANK: {DonationAmounts.totalRemainingAmount} zł</h1>
        <h2>DO BANKU DORZUCILI SIĘ:</h2>
        <dl className="menu-list">
          {ListOfTransfers.map((value, key) => {
            const donationButtonClassPerRow = `donationButton${key}`;
            return (
              <div
                className="menu-list-item donation"
                onClick={() => toggleVisibility(key)}
              >
                <div className="">
                  <p>{value.type} na kwotę {value.amount} zł</p>
                  
                </div>
                <div className="buttonContainer">
                  <button
                    className={`editDonationButton donationButton ${donationButtonClassPerRow}`}
                    onClick={() => {
                      navigate(`/${value.type}/${value.id}`);
                    }}
                  >
                    Edytuj
                  </button>
                </div>
                <div className="buttonContainer">
                  <button
                    className={`deleteDonationButton donationButton ${donationButtonClassPerRow}`}
                    onClick={() => {
                      if (
                        window.confirm("Czy chcesz usunąć tą wpłatę?") === true
                      )
                        axios
                          .delete(
                            `http://localhost:3001/donations/id/${value.id}`
                          )
                          .then((response) => {
                            navigate(0);
                          });
                    }}
                  >
                    Usuń
                  </button>
                </div>
              </div>
            );
          })}
        </dl>
      </div>
    </div>
  );
}

export default HomeAdmin;
