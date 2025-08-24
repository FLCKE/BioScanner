import React from "react";
import "./index.css";
import comingSoon from "../../assets/comingSoon.png";

// const data = [
//   { id: "1", date: "05/05/2025", status: "Absent" },
//   { id: "2", date: "05/05/2025", status: "Absent" },
//   { id: "3", date: "05/05/2025", status: "Absent" },
//   { id: "4", date: "05/05/2025", status: "Absent" },
//   { id: "5", date: "05/05/2025", status: "Absent" },
// ];

export default function JustificationScreen() {
  return (
    <div className="container-justify">
      <h3 className="section-title">Justificatifs</h3>

      {/* <div className="list">
        {data.map(item => (
          <div className="item" key={item.id}>
            <p className="item-date">Date<br />{item.date}</p>
            <p className="item-status">{item.status}</p>
          </div>
        ))}*/}
      <div className="text-center">
        <img src={comingSoon} className="imageComming" alt="comingSoon" />
        <h2 className="card-title">Bientot disponible</h2>
      </div>
    </div>
  );
}
